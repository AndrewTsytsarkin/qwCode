export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  board: Cell[][];
  status: GameStatus;
  mineCount: number;
  flagCount: number;
  timeElapsed: number;
}
