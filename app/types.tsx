type Player = {
  name: string;
  score: number;
}

type Session = {
  lobby: string;
  players: Player[];
  started: boolean;
}

type Question = {
  question: string,
  answer: number,
  questions: string[],
}

type Deck = {
  name: string,
  questions: Question[],
}

export type { Player, Session, Deck, Question };
