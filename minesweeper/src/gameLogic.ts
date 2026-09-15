import { Cell } from './types';

export const createBoard = (rows: number, cols: number, mineCount: number): Cell[][] => {
  // Initialize empty board
  const board: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    board[row] = [];
    for (let col = 0; col < cols; col++) {
      board[row][col] = {
        row,
        col,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborCount: 0,
      };
    }
  }

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);
    
    if (!board[randomRow][randomCol].isMine) {
      board[randomRow][randomCol].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor counts
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].isMine) {
        board[row][col].neighborCount = countNeighbors(board, row, col);
      }
    }
  }

  return board;
};

const countNeighbors = (board: Cell[][], row: number, col: number): number => {
  const rows = board.length;
  const cols = board[0].length;
  let count = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        if (board[newRow][newCol].isMine) {
          count++;
        }
      }
    }
  }

  return count;
};

export const revealCell = (
  board: Cell[][],
  row: number,
  col: number
): Cell[][] => {
  const rows = board.length;
  const cols = board[0].length;
  
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    return board;
  }

  const cell = board[row][col];
  
  if (cell.isRevealed || cell.isFlagged) {
    return board;
  }

  cell.isRevealed = true;

  // If it's an empty cell (no neighboring mines), reveal all adjacent cells
  if (cell.neighborCount === 0 && !cell.isMine) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          revealCell(board, newRow, newCol);
        }
      }
    }
  }

  return board;
};

export const checkWin = (board: Cell[][]): boolean => {
  for (const row of board) {
    for (const cell of row) {
      // Win if all non-mine cells are revealed
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
};

export const revealAllMines = (board: Cell[][]): Cell[][] => {
  const newBoard = board.map(row =>
    row.map(cell => ({
      ...cell,
      isRevealed: cell.isMine ? true : cell.isRevealed,
    }))
  );
  return newBoard;
};
