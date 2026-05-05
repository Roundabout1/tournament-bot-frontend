export interface Penalties {
  player1: boolean;
  player2: boolean;
}

export interface GameResult {
  table: string;
  players: string[];
  state: 'completed' | 'draw' | 'underplayed';
  winner: string | null;
  penalties: Penalties;
}

export interface TableInfo {
  table: string;
  player1: string;
  player2: string;
  hasFines: boolean;
}

export type Player = {
  number: string;
  kind: string;
};

export type Table = {
  number: string;
  players: Player[];
};

export type ResultState = 'completed' | 'draw' | 'underplayed';
