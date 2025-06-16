// src/game/Game.ts
import { Deck } from './Deck';
import { Player } from './Player';
import { Card } from './Card';
import { HandEvaluator } from './HandEvalluator';

export type GamePhase = 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown';


export class Game {
  public deck: Deck = new Deck(); 
  private pot: number = 0;
  public players: Player[] = [];
  private communityCards: Card[] = []
  private phase: GamePhase = 'pre-flop';
  private currentBet: number = 0;
  private isFirstRound: Boolean = true;

  constructor(players: Player[]) {
    this.players = players.map(player => new Player(player.name));
  }

  startNewRound(): void {
    this.isFirstRound = true;
    this.pot = 0;
    this.phase = 'pre-flop';
    this.communityCards = [];
    this.deck.reset();
    this.deck.shuffle();
    this.players.forEach(player => player.resetHand());

    for (let i = 0; i < 2; i++) {
        for (const player of this.players) {
          const hand = this.deck.deal(1);
          player.receiveCards(hand);
        }
    }
  }

  async collectBets(): Promise<void> {
    for (const player of this.players.filter(p => !p.hasFolded)) {
      const bet = await player.bet(this.currentBet, this.currentBet);
      if (this.currentBet === 0 && bet !== 0) {
        this.currentBet = bet;
      }
      
      this.pot += await bet;
    }
  }

  getPot(): number {
    console.log(this.pot)
    return this.pot;
  }

  getCommunityCards(): Card[] {
    console.log(this.communityCards)
    this.currentBet = 0;
    return this.communityCards;
    }

    nextPhase(): void {
        switch (this.phase) {
          case 'pre-flop':
            this.phase = 'flop';
            this.communityCards.push(...this.deck.deal(3));
            break;
          case 'flop':
            this.phase = 'turn';
            this.communityCards.push(...this.deck.deal(1));
            break;
          case 'turn':
            this.phase = 'river';
            this.communityCards.push(...this.deck.deal(1));
            break;
          case 'river':
            this.phase = 'showdown';
            case 'showdown':
                console.log("SHOWDOWN!");
                const rankings = this.players
                  .filter(p => !p.hasFolded)
                  .map(player => {
                    const bestHand = HandEvaluator.bestOfSeven([...player.hand, ...this.communityCards]);
                    return { player, hand: bestHand };
                  })
                  .sort((a, b) => HandEvaluator.compareHands(a.hand, b.hand));
              
                console.log("Results:");
                rankings.forEach(({ player, hand }, i) => {
                  console.log(
                    `#${i + 1}: ${player.name} with ${hand.name} — ${hand.cards.map(c => c.toString()).join(', ')}`
                  );
                });
                rankings[0].player.chips += this.getPot();
                
                
              
                break;
              
        }
    }
}