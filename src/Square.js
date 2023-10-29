export function Square({ value, onLeftClick, onRightClick, exploded }) {
  return (
    <button
      className={`square ${exploded ? "exploded" : ""}`}
      onClick={onLeftClick}
      onContextMenu={onRightClick}
    >
      {value}
    </button>
  );
}
