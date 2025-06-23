import { Card } from './Card.ts';


export interface EvaluatedHand {
    rank: number; // 0 = High Card, 9 = Royal Flush
    name: string;
    cards: Card[];
    kicker: Card[];
  }
  
  const RANK_ORDER = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
export class HandEvaluator {
static evaluateHand(cards: Card[]): EvaluatedHand {
    const sorted = [...cards].sort((a, b) => this.rankValue(b.rank) - this.rankValue(a.rank));
    const bySuit = this.groupBy(cards, c => c.suit);
    const byRank = this.groupBy(cards, c => c.rank);

    const isFlush = Object.values(bySuit).some(group => group.length >= 5);
    const straight = this.findStraight(sorted);

    if (isFlush && straight) {
    const flushSuit = Object.entries(bySuit).find(([_, group]) => group.length >= 5)![1]
  .sort((a, b) => this.rankValue(b.rank) - this.rankValue(a.rank));

    const flushStraight = this.findStraight(flushSuit);
    if (flushStraight) {
        const isRoyal = flushStraight[0].rank === 'A';
        return {
        rank: isRoyal ? 9 : 8,
        name: isRoyal ? 'Royal Flush' : 'Straight Flush',
        cards: flushStraight,
        kicker: [],
        };
    }
    }

    const rankGroups = Object.entries(byRank).map(([rank, cards]) => ({ rank, cards })).sort((a, b) => b.cards.length - a.cards.length || this.rankValue(b.rank) - this.rankValue(a.rank));

    if (rankGroups[0].cards.length === 4) {
    return {
        rank: 7,
        name: 'Four of a Kind',
        cards: [...rankGroups[0].cards, sorted.find(c => c.rank !== rankGroups[0].rank)!],
        kicker: sorted.filter(c => c.rank !== rankGroups[0].rank).slice(0, 1),
    };
    }

    if (rankGroups[0].cards.length === 3 && rankGroups[1]?.cards.length >= 2) {
    return {
        rank: 6,
        name: 'Full House',
        cards: [...rankGroups[0].cards, ...rankGroups[1].cards.slice(0, 2)],
        kicker: [],
    };
    }

    if (isFlush) {
    const flushCards = Object.values(bySuit).find(group => group.length >= 5)!.sort((a, b) => this.rankValue(b.rank) - this.rankValue(a.rank)).slice(0, 5);
    return {
        rank: 5,
        name: 'Flush',
        cards: flushCards,
        kicker: [],
    };
    }

    if (straight) {
    return {
        rank: 4,
        name: 'Straight',
        cards: straight,
        kicker: [],
    };
    }

    if (rankGroups[0].cards.length === 3) {
    const kickers = sorted.filter(c => c.rank !== rankGroups[0].rank).slice(0, 2);
    return {
        rank: 3,
        name: 'Three of a Kind',
        cards: [...rankGroups[0].cards, ...kickers],
        kicker: kickers,
    };
    }

    if (rankGroups[0].cards.length === 2 && rankGroups[1]?.cards.length === 2) {
    const kickers = sorted.filter(c => c.rank !== rankGroups[0].rank && c.rank !== rankGroups[1].rank).slice(0, 1);
    return {
        rank: 2,
        name: 'Two Pair',
        cards: [...rankGroups[0].cards, ...rankGroups[1].cards, ...kickers],
        kicker: kickers,
    };
    }

    if (rankGroups[0].cards.length === 2) {
    const kickers = sorted.filter(c => c.rank !== rankGroups[0].rank).slice(0, 3);
    return {
        rank: 1,
        name: 'One Pair',
        cards: [...rankGroups[0].cards, ...kickers],
        kicker: kickers,
    };
    }

    const highCards = this.getHighCard(cards);
    return {
    rank: 0,
    name: 'High Card',
    cards: highCards,
    kicker: highCards.slice(1),
    };
}

static getHighCard(cards: Card[]): Card[] {
    return [...cards].sort((a, b) => this.rankValue(b.rank) - this.rankValue(a.rank)).slice(0, 5);
}

static rankValue(rank: string): number {
    return RANK_ORDER.indexOf(rank);
}

static groupBy<T>(arr: T[], fn: (item: T) => string): Record<string, T[]> {
    return arr.reduce((acc, item) => {
    const key = fn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
    }, {} as Record<string, T[]>);
}

static findStraight(cards: Card[]): Card[] | null {
    const unique = Array.from(new Map(cards.map(card => [card.rank, card])).values());
    const values = unique.map(card => this.rankValue(card.rank));
    const sorted = [...new Set(values)].sort((a, b) => b - a);

    // Add Ace-low straight support
    const aceLowValues = sorted.includes(this.rankValue('A')) &&
                     sorted.includes(this.rankValue('2')) &&
                     sorted.includes(this.rankValue('3')) &&
                     sorted.includes(this.rankValue('4')) &&
                     sorted.includes(this.rankValue('5'));

if (aceLowValues) {
  const neededRanks = ['A', '2', '3', '4', '5'];
  return unique.filter(card => neededRanks.includes(card.rank));
}// Treat Ace as 1 for A-2-3-4-5

    for (let i = 0; i <= sorted.length - 5; i++) {
    let slice = sorted.slice(i, i + 5);
    if (slice[0] - slice[4] === 4) {
        const ranks = slice.map(val => RANK_ORDER[val >= 0 ? val : 12]);
        return unique.filter(card => ranks.includes(card.rank)).slice(0, 5);
    }
    }

    return null;
}

static combinations<T>(arr: T[], k: number): T[][] {
    if (k === 0) return [[]];
    if (arr.length < k) return [];
    const [head, ...tail] = arr;
    return [
    ...this.combinations(tail, k),
    ...this.combinations(tail, k - 1).map(comb => [head, ...comb])
    ];
}

static bestOfSeven(cards: Card[]): EvaluatedHand {
    const hands = this.combinations(cards, 5);
    const evaluated = hands.map(this.evaluateHand.bind(this));
    evaluated.sort((a, b) => this.compareHands(a, b));
    return evaluated[0];
}

static compareHands(a: EvaluatedHand, b: EvaluatedHand): number {
    if (a.rank !== b.rank) return b.rank - a.rank;
    for (let i = 0; i < 5; i++) {
    const diff = this.rankValue(b.cards[i].rank) - this.rankValue(a.cards[i].rank);
    if (diff !== 0) return diff;
    
    }
    return 0;
}
}