type Player = {
  name: string;
  score: number;
}

type Lobby = {
  lobby: string;
  players: Player[];
  started: boolean;
}

type Question = {
  question: string,
  answer: number,
  answers: string[],
}

type Deck = {
  name: string,
  questions: Question[],
}

export type { Player, Lobby, Deck, Question };
