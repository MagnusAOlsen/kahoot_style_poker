import * as readline from 'readline';
import { Card } from './Card.ts';

/* function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    return new Promise(resolve =>
      rl.question(query, answer => {
        rl.close();
        resolve(answer);
      })
    );
  } */

export class Player {
  hand: Card[] = [];
  chips: number;
  name: string;
  hasFolded: boolean = false;
  position: number;
  private resolveBet?: (amount: number) => void;
  public notifyTurn?: (playerName: string) => void;

  constructor(name: string, startingChips: number = 1000) {
    this.name = name;
    this.chips = startingChips;
  }

  receiveCards(cards: Card[]): void {
    this.hand = [...this.hand, ...cards];
  }

  receiveChips(amount: number): void {
    this.chips += amount;
  }

  betChips(amount: number): void {
    this.chips -= amount;
  };


  public async bet(leastBet: number, currentBet: number): Promise<number> {
    if (this.notifyTurn) {
      this.notifyTurn(this.name);
    }

    return new Promise((resolve) => {
      this.resolveBet = (amount: number) => {
        if (amount === 0 && currentBet !== 0) {
          this.fold();
          resolve(0);}
        else {
          const bet = Math.max(Math.min(amount, this.chips), leastBet);
          this.chips -= bet;
          resolve(bet);
        }
      };
    });
  }

  respondToBet(amount: number): void {
    if (this.resolveBet) {
      this.resolveBet(amount);
      this.resolveBet = undefined; 
    }
  }


  fold(): void {
    this.hand = [];
    this.hasFolded = true;
  }

  resetHand(): void {
    this.hand = [];
    this.hasFolded = false;
    this.resolveBet = undefined; // Reset the bet resolver
  }
}
