import React, { useState, useEffect, useCallback } from 'react';
import { Cell, GameStatus } from './types';
import { createBoard, revealCell as revealCellLogic, checkWin, revealAllMines } from './gameLogic';
import CellComponent from './Cell';

interface BoardProps {
  rows: number;
  cols: number;
  mineCount: number;
}

const Board: React.FC<BoardProps> = ({ rows, cols, mineCount }) => {
  const [board, setBoard] = useState<Cell[][]>(() => createBoard(rows, cols, mineCount));
  const [status, setStatus] = useState<GameStatus>('playing');
  const [flagCount, setFlagCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (status === 'playing' && timeElapsed < 999) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, timeElapsed]);

  const handleLeftClick = useCallback((row: number, col: number) => {
    if (status !== 'playing') return;
    
    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    // Если попали на мину - сразу проигрыш
    if (cell.isMine) {
      // Game over - reveal all mines
      const newBoard = revealAllMines(board);
      setBoard(newBoard);
      setStatus('lost');
      return;
    }

    // Открываем ячейку
    const newBoard = JSON.parse(JSON.stringify(board)) as Cell[][];
    revealCellLogic(newBoard, row, col);
    setBoard([...newBoard]);

    // Check for win
    if (checkWin(newBoard)) {
      setStatus('won');
    }
  }, [board, status, rows, cols, mineCount]);

  const handleRightClick = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (status !== 'playing') return;

    const cell = board[row][col];
    if (cell.isRevealed) return;

    const newBoard = board.map(r =>
      r.map(c => {
        if (c.row === row && c.col === col) {
          return { ...c, isFlagged: !c.isFlagged };
        }
        return c;
      })
    );

    setBoard(newBoard);
    setFlagCount(prev => cell.isFlagged ? prev - 1 : prev + 1);
  }, [board, status]);

  const resetGame = () => {
    setBoard(createBoard(rows, cols, mineCount));
    setStatus('playing');
    setFlagCount(0);
    setTimeElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusMessage = () => {
    if (status === 'won') return '🎉 You Win!';
    if (status === 'lost') return '💥 Game Over!';
    return '😎 Good Luck!';
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
  };

  const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 30px)`,
    gap: '1px',
    backgroundColor: '#999',
    padding: '5px',
    border: '3px inset #fff',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  };

  return (
    <div style={containerStyle}>
      <h1>Minesweeper</h1>
      
      <div style={headerStyle}>
        <div>
          <strong>Mines:</strong> {mineCount - flagCount}
        </div>
        <div style={{ fontSize: '24px' }}>
          {status === 'won' ? '😎' : status === 'lost' ? '😵' : '🙂'}
        </div>
        <div>
          <strong>Time:</strong> {formatTime(timeElapsed)}
        </div>
      </div>

      <div style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
        {getStatusMessage()}
      </div>

      <div style={boardStyle}>
        {board.map(row =>
          row.map(cell => (
            <CellComponent
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              onLeftClick={handleLeftClick}
              onRightClick={handleRightClick}
            />
          ))
        )}
      </div>

      <button 
        style={{ ...buttonStyle, marginTop: '20px' }}
        onClick={resetGame}
      >
        New Game
      </button>
    </div>
  );
};

export default Board;
