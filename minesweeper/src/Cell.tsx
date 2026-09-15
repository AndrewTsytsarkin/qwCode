import React from 'react';
import { Cell } from './types';

interface CellProps {
  cell: Cell;
  onLeftClick: (row: number, col: number) => void;
  onRightClick: (e: React.MouseEvent, row: number, col: number) => void;
}

const CellComponent: React.FC<CellProps> = ({ cell, onLeftClick, onRightClick }) => {
  const getCellContent = () => {
    if (cell.isFlagged && !cell.isRevealed) {
      return '🚩';
    }
    
    if (!cell.isRevealed) {
      return '';
    }
    
    if (cell.isMine) {
      return '💣';
    }
    
    if (cell.neighborCount > 0) {
      return cell.neighborCount.toString();
    }
    
    return '';
  };

  const getCellColor = () => {
    if (!cell.isRevealed) return '#c0c0c0';
    if (cell.isMine) return '#ff4444';
    
    const colors: { [key: number]: string } = {
      1: '#0000ff',
      2: '#008000',
      3: '#ff0000',
      4: '#000080',
      5: '#800000',
      6: '#008080',
      7: '#000000',
      8: '#808080',
    };
    
    return colors[cell.neighborCount] || '#000000';
  };

  const style: React.CSSProperties = {
    width: '30px',
    height: '30px',
    border: cell.isRevealed ? '1px solid #999' : '2px outset #fff',
    backgroundColor: cell.isRevealed ? (cell.isMine ? '#ff4444' : '#ddd') : '#c0c0c0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    color: getCellColor(),
    cursor: 'pointer',
    userSelect: 'none',
    fontFamily: 'Arial, sans-serif',
  };

  const handleClick = () => {
    if (!cell.isRevealed && !cell.isFlagged) {
      onLeftClick(cell.row, cell.col);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(e, cell.row, cell.col);
  };

  return (
    <div 
      style={style} 
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {getCellContent()}
    </div>
  );
};

export default CellComponent;
