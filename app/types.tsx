type Player = {
  name: string;
  score: number;
}

type Session = {
  lobby: string;
  players: Player[];
  started: boolean;
}

export { Player, Session };
