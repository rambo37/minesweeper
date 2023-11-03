export function GameControls({ rows, cols, numberOfMines, reset, replay }) {
  return (
    <div className="game-controls">
      <button onClick={() => reset(rows, cols, numberOfMines)}>New game</button>
      <button onClick={replay} className="replay-button">
        Replay
      </button>
    </div>
  );
}
