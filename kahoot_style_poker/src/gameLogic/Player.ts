import * as readline from 'readline';
import { Card } from './Card.ts';

function askQuestion(query: string): Promise<string> {
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
  }

export class Player {
  hand: Card[] = [];
  chips: number;
  name: string;
  hasFolded: boolean = false;
  position: number;

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


  public async bet(leastBet: number, currentBet: number): Promise<number> {
    const input = await askQuestion(`How much do you wanna bet, ${this.name}? `);
    const amount = parseInt(input, 10);

    if (isNaN(amount) || amount < 0) {
      console.log("Invalid input. Betting 0.");
      return 0;
    }

    if (amount === 0 && currentBet !== 0) {
        this.fold();
        return 0;
    }

    const bet = Math.max(Math.min(amount, this.chips), leastBet);
    this.chips -= bet;
    console.log(this.name + " betted " + bet + " kr" )
    return bet;
  }

  fold(): void {
    this.hand = [];
    this.hasFolded = true;
  }

  resetHand(): void {
    this.hand = [];
    this.hasFolded = false;
  }
}
