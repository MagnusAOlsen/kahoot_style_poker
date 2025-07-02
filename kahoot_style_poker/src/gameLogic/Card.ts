export type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export class Card {
    public suit: Suit; 
    public rank: Rank;
  
    constructor(suit: Suit, rank: Rank) {
      this.suit = suit; 
      this.rank = rank;
    }

  toString(): string {
    return `${this.rank} of ${this.suit}`;
  }
}
