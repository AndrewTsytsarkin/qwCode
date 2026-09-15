import Board from './Board';

function App() {
  // Classic beginner difficulty: 9x9 grid with 10 mines
  const rows = 9;
  const cols = 9;
  const mineCount = 10;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Board rows={rows} cols={cols} mineCount={mineCount} />
    </div>
  );
}

export default App;
