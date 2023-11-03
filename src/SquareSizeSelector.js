export function SquareSizeSelector({ squareSize, setSquareSize }) {
  return (
    <div className="board-size-controls">
      <label htmlFor="sizes">Select square size:</label>
      <select
        name="sizes"
        id="sizes"
        value={squareSize}
        onChange={(e) => setSquareSize(e.target.value)}
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>
  );
}
