type Player = {
  name: string;
  score: number;
  answers: { questionIndex: number, answerIndex: number}[],
}

type Lobby = {
  lobby: string;
  deck: string;
  players: Player[];
  started: boolean;
}

type Question = {
  question: string,
  answer: number,
  answers: string[],
}

type Deck = {
  title: string,
  description: string,
  questions: Question[],
}

export type { Player, Lobby, Deck, Question };
