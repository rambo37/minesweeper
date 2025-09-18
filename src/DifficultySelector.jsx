import { EASY, MEDIUM, EXPERT, CUSTOM } from "./constants";
import { useState } from "react";

export function DifficultySelector({
  selectedMode,
  setSelectedMode,
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
  const [rowsInputClass, setRowsInputClass] = useState("");
  const [colsInputClass, setColsInputClass] = useState("");
  const [minesInputClass, setMinesInputClass] = useState("");
  const [error, setError] = useState(null);

  function handleSubmit() {
    setSelectedMode(CUSTOM);
    if (!validateParameters()) return;
    customMode(customRows, customCols, customMines);
  }

  // Checks the game parameters are valid. Displays an error and returns false if
  // they are not, else removes any errors that may be present and returns true.
  function validateParameters() {
    setRowsInputClass("");
    setColsInputClass("");
    setMinesInputClass("");
    let invalidRows = customRows < 1;
    let invalidCols = customCols < 1;
    let invalidMines = customMines < 1;

    if (invalidRows || invalidCols || invalidMines) {
      setError(
        "The number of rows, columns, and mines must all be at least 1."
      );
      if (invalidRows) setRowsInputClass("error");
      if (invalidCols) setColsInputClass("error");
      if (invalidMines) setMinesInputClass("error");
      return false;
    }

    invalidRows = !Number.isInteger(customRows);
    invalidCols = !Number.isInteger(customCols);
    invalidMines = !Number.isInteger(customMines);

    if (invalidRows || invalidCols || invalidMines) {
      setError(
        "The number of rows, columns, and mines must all be whole numbers."
      );
      if (invalidRows) setRowsInputClass("error");
      if (invalidCols) setColsInputClass("error");
      if (invalidMines) setMinesInputClass("error");
      return false;
    }

    const size = customRows * customCols;

    if (size > 1600) {
      setError(
        "The grid is too large. Please lower the number of rows and/or " +
          "columns to no more than 40x40 (no more than 1600 squares in total)."
      );
      setRowsInputClass("error");
      setColsInputClass("error");
      return false;
    }

    if (customMines >= size) {
      setError(
        `The grid must contain at least one safe square. You have ${
          customMines - (size - 1)
        } more mine${customMines === size ? "" : "s"} than allowed.`
      );
      setMinesInputClass("error");
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
          onClick={() => handleSubmit()}
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
          className={rowsInputClass}
          value={customRows}
          min={1}
          onChange={(e) => setCustomRows(Number(e.target.value))}
        ></input>
        <label htmlFor="cols">Columns: </label>
        <input
          type="number"
          id="cols"
          className={colsInputClass}
          value={customCols}
          min={1}
          onChange={(e) => setCustomCols(Number(e.target.value))}
        ></input>
        <label htmlFor="mines">Mines: </label>
        <input
          type="number"
          id="mines"
          className={minesInputClass}
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
