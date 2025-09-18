import React, { useRef, useEffect, useState } from "react";
import { Square } from "./Square.jsx";

export function Board({
  cols,
  handleLeftClick,
  handleRightClick,
  squares,
  explodedSquareIndex,
  squareSize,
}) {
  const boardRef = useRef(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    updateOverflowing();

    window.addEventListener("resize", () => {
      updateOverflowing();
    });
  }, [cols, squareSize]);

  // Updates the overflowing state based on whether the board's scollWidth is
  // greater than the board's offsetWidth (i.e., it is overflowing)
  function updateOverflowing() {
    setOverflowing(boardRef.current.scrollWidth > boardRef.current.offsetWidth);
  }

  return (
    <div
      ref={boardRef}
      className="board"
      style={{
        gridTemplateColumns: `repeat(${cols}, max-content)`,
        justifyContent: `${overflowing ? "flex-start" : "center"}`,
      }}
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
