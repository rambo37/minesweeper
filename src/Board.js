import { Square } from "./Square";

export function Board({
	cols,
  handleLeftClick,
  handleRightClick,
  squares,
  explodedSquareIndex,
  squareSize,
}) {
  return (
    <div
      className="board"
      style={{ gridTemplateColumns: `repeat(${cols}, max-content)` }}
    >
      {squares.map((value, index) => {
        return (
          <Square
            key={index}
            value={value}
            onLeftClick={() => handleLeftClick(index)}
            onRightClick={(event) => handleRightClick(event, index)}
            exploded={index === explodedSquareIndex}
            size={squareSize}
          />
        );
      })}
    </div>
  );
}
