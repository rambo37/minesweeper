export function Square({ value, onLeftClick, onRightClick, exploded, size }) {
  return (
    <button
      className={`square ${exploded ? "exploded" : ""} ` + size}
      onClick={onLeftClick}
      onContextMenu={onRightClick}
    >
      {value}
    </button>
  );
}
