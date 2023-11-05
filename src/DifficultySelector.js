import { EASY, MEDIUM, EXPERT, CUSTOM } from "./constants";
import { useState } from "react";

export function DifficultySelector({
  selectedMode,
  easyMode,
  mediumMode,
  expertMode,
  customMode,
}) {
  // These state variables and setters have been defined in this component rather
  // than in the parent (App) since the parent does not ever manipulate these
  // values or handle any of the logic.
  const [customRows, setCustomRows] = useState(CUSTOM.rows);
  const [customCols, setCustomCols] = useState(CUSTOM.cols);
  const [customMines, setCustomMines] = useState(CUSTOM.mines);
  const [error, setError] = useState(null);

  function handleSubmit() {
    if (!validateParameters()) return;
    customMode(customRows, customCols, customMines);
  }

  // Checks the game parameters are valid. Displays an error and returns false if
  // they are not, else removes any errors that may be present and returns true.
  function validateParameters() {
    if (customRows < 1 || customCols < 1 || customMines < 1) {
      setError(
        "The number of rows, columns, and mines must all be at least 1."
      );
      return false;
    }

    if (
      !Number.isInteger(customRows) ||
      !Number.isInteger(customCols) ||
      !Number.isInteger(customMines)
    ) {
      setError(
        "The number of rows, columns, and mines must all be whole numbers."
      );
      return false;
    }

    const size = customRows * customCols;

    if (size > 1600) {
      setError(
        "The grid is too large. Please lower the number of rows and/or " +
          "columns to no more than 40x40 (no more than 1600 squares in total)."
      );
      return false;
    }

    if (customMines >= size) {
      setError(
        `The grid must contain at least one safe square. You have ${
          customMines - (size - 1)
        } more mine${customMines === size ? "" : "s"} than allowed.`
      );
      return false;
    }

    setError(null);
    return true;
  }

  return (
    <div className="difficulty-controls">
      Select difficulty:
      <br />
      <div className="difficulty-buttons">
        <button
          className={`easy-mode ${selectedMode === EASY ? "active" : ""}`}
          onClick={() => easyMode()}
        >
          Easy<span>9x9</span>
        </button>
        <button
          className={`medium-mode ${selectedMode === MEDIUM ? "active" : ""}`}
          onClick={() => mediumMode()}
        >
          Medium<span>16x16</span>
        </button>
        <button
          className={`expert-mode ${selectedMode === EXPERT ? "active" : ""}`}
          onClick={() => expertMode()}
        >
          Expert<span>16x30</span>
        </button>
        <button
          className={`custom-mode ${selectedMode === CUSTOM ? "active" : ""}`}
          onClick={() => customMode(customRows, customCols, customMines)}
        >
          Custom<span>?</span>
        </button>
      </div>
      <div
        className={`custom-inputs ${selectedMode === CUSTOM ? "" : "hidden"}`}
      >
        <label htmlFor="rows">Rows: </label>
        <input
          type="number"
          id="rows"
          value={customRows}
          min={1}
          onChange={(e) => setCustomRows(Number(e.target.value))}
        ></input>
        <label htmlFor="cols">Columns: </label>
        <input
          type="number"
          id="cols"
          value={customCols}
          min={1}
          onChange={(e) => setCustomCols(Number(e.target.value))}
        ></input>
        <label htmlFor="mines">Mines: </label>
        <input
          type="number"
          id="mines"
          value={customMines}
          min={1}
          onChange={(e) => setCustomMines(Number(e.target.value))}
        ></input>
        <button onClick={() => handleSubmit()}>Go</button>
        {error && <div className="error-div">{error}</div>}
      </div>
    </div>
  );
}
