export function GameControls({ reset, replay }) {
  return (
    <div className="game-controls">
      <button onClick={reset}>New game</button>
      <button onClick={replay} className="replay-button">
        Replay
      </button>
    </div>
  );
}
