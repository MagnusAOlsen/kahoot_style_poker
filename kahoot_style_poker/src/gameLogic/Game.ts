// src/game/Game.ts
import { Deck } from './Deck.ts';
import { Player } from './Player.ts';
import { Card } from './Card.ts';
import { HandEvaluator } from './HandEvaluator.ts';
import type { EvaluatedHand } from './HandEvaluator.ts';

export type GamePhase = 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown';
export type Ranking = {
  player: Player;
  hand: EvaluatedHand;
}

export class Game {
  public deck: Deck = new Deck(); 
  private pot: number = 0;
  public players: Player[] = [];
  private communityCards: Card[] = []
  private phase: GamePhase = 'pre-flop';
  private currentBet: number = 0;
  private isFirstRound: Boolean = true;
  public currentPlayer: Player | null = null;
  public dealerPostion: number;

  constructor(players: Player[]) {
    this.players = players;
  }

  startNewRound(dealerPosition: number): void {
    this.isFirstRound = true;
    this.pot = 0;
    this.phase = 'pre-flop';
    this.communityCards = [];
    this.deck.reset();
    this.deck.shuffle();
    this.players.forEach(player => player.resetHand());
    this.dealerPostion = dealerPosition;

    for (let i = 0; i < 2; i++) {
        for (const player of this.players) {
          const hand = this.deck.deal(1);
          player.receiveCards(hand);
        }
    }
    this.postBlinds();
  }

  async collectBets(): Promise<void> {
    let activePlayers = this.players.filter(p => !p.hasFolded);
    const bets = new Map<Player, number>();
    const smallBlindPlayer = activePlayers.find(p => p.isSmallBlind);
    const bigBlindPlayer = activePlayers.find(p => p.isBigBlind);

    for (const p of activePlayers) {
      bets.set(p, 0);
    }
  
    let currentPlayerIndex: number;
    let lastBet: number;
    let lastRaiserIndex: number;
    let playersWhoActed = new Set<Player>();

    if (this.phase === 'pre-flop') {
      currentPlayerIndex = (this.dealerPostion + 3) % activePlayers.length; // Start after big blind
      lastBet = 2;
      lastRaiserIndex = (this.dealerPostion + 2) % activePlayers.length; // Big blind is last raiser
      playersWhoActed.add(activePlayers[lastRaiserIndex-1]);
      playersWhoActed.add(activePlayers[lastRaiserIndex]);
      bets.set(smallBlindPlayer!, 1); // Small blind
      bets.set(bigBlindPlayer!, 2); // Big blind
      
    } else {
      currentPlayerIndex = (this.dealerPostion + 1) % activePlayers.length;
      lastBet = 0; // No bets yet
      lastRaiserIndex = -1; 
    }
    
  
    while (true) {
      if (activePlayers.length <= 1) break;
  
      const player = activePlayers[currentPlayerIndex];
      this.currentPlayer = player;

      console.log("Current player:", player.name);
  
      const playerBetSoFar = bets.get(player)!;
      console.log(`Player ${player.name} has bet so far: ${playerBetSoFar}`);
      const amountToCall = Math.max(lastBet - playerBetSoFar, 0);
  
      const bet = await player.bet(amountToCall, lastBet);
      
  
      if (bet === -2) {
        // Fold
        player.fold();
        bets.delete(player);
        activePlayers = activePlayers.filter(p => !p.hasFolded);
        console.log(activePlayers.length + " players left in the game");
        playersWhoActed.delete(player);
        if (activePlayers.length <= 1) break;
        // Don't increment index since the list shrank
        if (currentPlayerIndex >= activePlayers.length) currentPlayerIndex = 0;
        continue;
      } 
      else if (bet == -1) {
        const totalBet = playerBetSoFar + amountToCall;
        console.log(`Player ${player.name} calls the bet of ${amountToCall}, and has now betted ${totalBet}`);
        bets.set(player, totalBet);
        this.pot += amountToCall;
      }

      else {
        const totalBet = playerBetSoFar + bet;
        bets.set(player, totalBet);
        this.pot += bet;
  
        if (bet > amountToCall) {
          // Raise
          lastRaiserIndex = currentPlayerIndex;
          lastBet = totalBet;
          playersWhoActed = new Set([player]); // Reset – everyone else must respond
        } else {
          // Called or checked
          playersWhoActed.add(player);
        }
      }
      console.log(`Player ${player.name} bets: ${bets.get(player)}` + " And has betted so far: " + playerBetSoFar);
  
      // If everyone has acted after the last raise (or initial check), we can break
      

      if (this.phase !== "pre-flop" || !bigBlindPlayer || !(bets.get(bigBlindPlayer) === 2)) {
        if (activePlayers.every(p => p.hasFolded || (bets.get(p) === lastBet && playersWhoActed.has(p)))) {
          break;
        }

      }

      
  
      currentPlayerIndex = (currentPlayerIndex + 1) % activePlayers.length;
    }
  
    this.currentPlayer = null;
    this.currentBet = 0;
  }

  private postBlinds(): void {
    const activePlayers = this.players.filter(p => !p.hasFolded && p.chips > 0);
    const smallBlindIndex = (this.dealerPostion + 1) % activePlayers.length;
    const bigBlindIndex = (this.dealerPostion + 2) % activePlayers.length;
    const smallBlindPlayer = activePlayers[smallBlindIndex];
    const bigBlindPlayer = activePlayers[bigBlindIndex];

    smallBlindPlayer.isSmallBlind = true;
    bigBlindPlayer.isBigBlind = true;

    const smallBlindAmount = Math.min(1, smallBlindPlayer.chips);
    const bigBlindAmount = Math.min(2, bigBlindPlayer.chips);

    smallBlindPlayer.betChips(smallBlindAmount);
    bigBlindPlayer.betChips(bigBlindAmount);
    this.pot += smallBlindAmount + bigBlindAmount;
    this.currentBet = bigBlindAmount;
  }
  
  

  getPot(): number {
    console.log(this.pot)
    return this.pot;
  }

  rankPlayers(): Ranking[] {
    return this.players
      .filter(p => !p.hasFolded)
      .map(player => {
        const bestHand = HandEvaluator.bestOfSeven([...player.hand, ...this.communityCards]);
        return { player, hand: bestHand };
      })
      .sort((a, b) => HandEvaluator.compareHands(a.hand, b.hand));
  }

  payOut(ranking: Ranking[]): void {
    console.log("Payout");
    const winningHand = ranking[0].hand;
    const allWinners: Player[] = [];

    ranking.forEach(({ player, hand }) => {
      if (HandEvaluator.compareHands(hand, winningHand) === 0) {
        allWinners.push(player);
      }
  });

  const share = this.getPot() / allWinners.length;
  allWinners.forEach(player => {
    player.receiveChips(share);
  });

  console.log('Results');
  ranking.forEach(({ player, hand }, i) => {
    console.log(
      `#${i + 1}: ${player.name} with ${hand.name} — ${hand.cards.map(c => c.toString()).join(', ')} with number of chips: ${player.chips}`
    );
  });
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
                
                break;
              
        }
    }
}