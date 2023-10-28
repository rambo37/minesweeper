export function Square({ value, onLeftClick, onRightClick }) {
  return (
    <button
      className="square"
      onClick={onLeftClick}
      onContextMenu={onRightClick}
    >
      {value}
    </button>
  );
}
