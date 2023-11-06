import { useState } from "react";
import { EASY, MEDIUM, EXPERT, CUSTOM } from "./constants";
import { Status } from "./Status";
import { Board } from "./Board";
import { GameControls } from "./GameControls";
import { DifficultySelector } from "./DifficultySelector";
import { SquareSizeSelector } from "./SquareSizeSelector";
import { Help } from "./Help";
import { ReactComponent as Mine } from "./images/mine.svg";
import { ReactComponent as Flag } from "./images/flag.svg";
import { ReactComponent as Number1 } from "./images/number1.svg";
import { ReactComponent as Number2 } from "./images/number2.svg";
import { ReactComponent as Number3 } from "./images/number3.svg";
import { ReactComponent as Number4 } from "./images/number4.svg";
import { ReactComponent as Number5 } from "./images/number5.svg";
import { ReactComponent as Number6 } from "./images/number6.svg";
import { ReactComponent as Number7 } from "./images/number7.svg";
import { ReactComponent as Number8 } from "./images/number8.svg";
import { ReactComponent as UnopenedSquare } from "./images/unopened_square.svg";

export default function App() {
  const [selectedMode, setSelectedMode] = useState(EASY);
  const [rows, setRows] = useState(selectedMode.rows);
  const [cols, setCols] = useState(selectedMode.cols);
  const size = rows * cols;
  const [squares, setSquares] = useState(Array(size).fill(<UnopenedSquare />));
  const [numberOfMines, setNumberOfMines] = useState(selectedMode.mines);
  const [minesRemaining, setMinesRemaining] = useState(selectedMode.mines);
  // This keeps track of whether at least one square has been opened
  const [gameStarted, setGameStarted] = useState(false);
  // This keeps track of whether the mines have been placed
  const [gameInitialised, setGameInitialised] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [mineIndexes, setMineIndexes] = useState([]);
  const [openedSquares, setOpenedSquares] = useState(Array(size).fill(false));
  const [flaggedSquares, setflaggedSquares] = useState(Array(size).fill(false));
  const [explodedSquareIndex, setExplodedSquareIndex] = useState(null);
  const [squareSize, setSquareSize] = useState("medium");
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(true);

  window.onbeforeunload = function () {
    if (gameInProgress()) {
      return "Are you sure you want to leave?";
    }
  };

  function handleLeftClick(index) {
    if (gameWon || gameLost || flaggedSquares[index]) return;

    if (paused) setPaused(false);

    // It is necessary to initialise the game after the user's first click
    // to ensure it is impossible for them to click on a square containing a
    // mine right at the beginning.
    if (!gameInitialised) {
      setGameInitialised(true);
      initaliseGame(index);
      return;
    }

    if (mineIndexes.includes(index)) {
      // A new array to hold the next set of squares after this move.
      const nextSquares = squares.slice();
      // Show all mines if a square containing a mine is clicked on
      for (let i = 0; i < mineIndexes.length; i++) {
        const mineIndex = mineIndexes[i];
        nextSquares[mineIndex] = <Mine />;
      }
      setExplodedSquareIndex(index);
      setSquares(nextSquares);
      setGameLost(true);
      setPaused(true);
      return;
    }

    openSquare(index, mineIndexes);
  }

  function handleRightClick(event, index) {
    event.preventDefault();
    // Do nothing if the game has not been initialised / has finished or if the
    // square that was right-clicked was already open
    if (!gameInitialised || gameWon || gameLost || openedSquares[index]) return;

    const nextSquares = squares.slice();
    const nextFlaggedSquares = flaggedSquares.slice();
    nextSquares[index] = flaggedSquares[index] ? <UnopenedSquare /> : <Flag />;
    nextFlaggedSquares[index] = !flaggedSquares[index];
    setSquares(nextSquares);
    setflaggedSquares(nextFlaggedSquares);
    setMinesRemaining(
      !nextFlaggedSquares[index] ? minesRemaining + 1 : minesRemaining - 1
    );
  }

  // Opens a square in the grid, displaying the correct number of adjacent mines.
  // If there are no adjacent mines, also opens all neighbours. This process can
  // repeat several times.
  function openSquare(index, mineIndexes) {
    setGameStarted(true);
    const nextSquares = squares.slice();
    const nextOpenedSquares = openedSquares.slice();

    // List of all the squares we need to open, initially just the one at
    // position index
    const openList = [index];

    // Need to open all adjacent squares if there are no mines adjacent to
    // the square at position index

    while (openList.length > 0) {
      const index = openList.pop();
      const numberOfAdjacentMines = getNumberOfAdjacentMines(
        index,
        mineIndexes,
        rows,
        cols
      );

      // Put the correct image in the corresponding cell of the nextSquares array
      // and mark this index as open
      nextSquares[index] = getCorrespondingImage(numberOfAdjacentMines);
      nextOpenedSquares[index] = true;

      // If there are no adjacent mines, open all adjacent locations. If any
      // adjacent location has no mines adjacent to it, add it to the open list
      // provided it has not already been opened.
      if (numberOfAdjacentMines === 0) {
        const neighbours = getNeighbours(index, rows, cols);
        neighbours.forEach((neighbourIndex) => {
          // Only add the neighbour to the list if it is not already open
          if (!nextOpenedSquares[neighbourIndex]) {
            openList.push(neighbourIndex);
          }
        });
      }
    }

    if (gameHasBeenWon(mineIndexes, nextOpenedSquares)) {
      setPaused(true);
      setGameWon(true);
    }
    setSquares(nextSquares);
    setOpenedSquares(nextOpenedSquares);
  }

  // Checks if the game has been won (i.e., there are no unopened squares remaining
  // that do not contain mines)
  function gameHasBeenWon(mineIndexes, openedSquares) {
    for (let i = 0; i < openedSquares.length; i++) {
      // If the square is not a mine and it is not opened, then we have an
      // unopened square
      if (!mineIndexes.includes(i) && !openedSquares[i]) {
        return false;
      }
    }
    return true;
  }

  // startingSquareIndex must not contain a mine
  function initaliseGame(startingSquareIndex) {
    const mineIndexes = [];
    let createdMines = 0;
    while (createdMines !== numberOfMines) {
      const index = getRandomInt(squares.length);
      if (index !== startingSquareIndex && !mineIndexes.includes(index)) {
        mineIndexes.push(index);
        createdMines++;
      }
    }

    openSquare(startingSquareIndex, mineIndexes);
    setMineIndexes(mineIndexes);
  }

  // Only change the selected mode if the game is successfully reset
  function easyMode() {
    if (reset(EASY.rows, EASY.cols, EASY.mines)) setSelectedMode(EASY);
  }

  function mediumMode() {
    if (reset(MEDIUM.rows, MEDIUM.cols, MEDIUM.mines)) setSelectedMode(MEDIUM);
  }

  function expertMode() {
    if (reset(EXPERT.rows, EXPERT.cols, EXPERT.mines)) setSelectedMode(EXPERT);
  }

  function customMode(customRows, customCols, customMines) {
    if (reset(customRows, customCols, customMines)) setSelectedMode(CUSTOM);
  }

  // Starts a fresh game - the parameters are for the new game. Returns true if
  // the game is successfully restarted and false otherwise
  function reset(numRows, numCols, numMines) {
    if (!checkAndWarnForProgessLoss()) return false;
    const numSquares = numRows * numCols;
    setRows(numRows);
    setCols(numCols);
    setNumberOfMines(numMines);
    setSquares(Array(numSquares).fill(<UnopenedSquare />));
    setMinesRemaining(numMines);
    setGameInitialised(false);
    setGameStarted(false);
    setGameWon(false);
    setGameLost(false);
    setMineIndexes([]);
    setOpenedSquares(Array(numSquares).fill(false));
    setflaggedSquares(Array(numSquares).fill(false));
    setExplodedSquareIndex(null);
    resetTimer();
    return true;
  }

  // Starts the current game again - by not setting gameInitialised to false and
  // mineIndexes to [], the mines will retain their positions.
  function replay() {
    if (!checkAndWarnForProgessLoss()) return;
    const numSquares = rows * cols;
    setSquares(Array(numSquares).fill(<UnopenedSquare />));
    setMinesRemaining(numberOfMines);
    setGameStarted(false);
    setGameWon(false);
    setGameLost(false);
    setOpenedSquares(Array(numSquares).fill(false));
    setflaggedSquares(Array(numSquares).fill(false));
    setExplodedSquareIndex(null);
    resetTimer();
  }

  // Returns false if the game should not be ended/restarted and true otherwise
  function checkAndWarnForProgessLoss() {
    if (gameInProgress()) {
      if (!window.confirm("Progress will be lost. Are you sure?")) {
        return false;
      }
    }
    return true;
  }

  function gameInProgress() {
    return gameStarted && !gameLost && !gameWon;
  }

  function resetTimer() {
    setSeconds(0);
    setPaused(true);
  }

  let status;
  let statusClass;
  if (gameLost) {
    status = "Oh no, you triggered a mine!";
    statusClass = "status loss";
  } else if (gameWon) {
    status = "Congratulations, you won!";
    statusClass = "status win";
  } else {
    status = `${minesRemaining} mine${
      minesRemaining === 1 ? "" : "s"
    } remaining`;
    statusClass = "status";
  }

  return (
    <>
      <h1 className="title">Minesweeper</h1>
      <div className="centered-div">
        <Status
          statusClass={statusClass}
          status={status}
          seconds={seconds}
          setSeconds={setSeconds}
          paused={paused}
        />
        <Board
          cols={cols}
          handleLeftClick={handleLeftClick}
          handleRightClick={handleRightClick}
          squares={squares}
          explodedSquareIndex={explodedSquareIndex}
          squareSize={squareSize}
        />
        <div>
          <GameControls
            rows={rows}
            cols={cols}
            numberOfMines={numberOfMines}
            reset={reset}
            replay={replay}
          />
          <DifficultySelector
            selectedMode={selectedMode}
            easyMode={easyMode}
            mediumMode={mediumMode}
            expertMode={expertMode}
            customMode={customMode}
          />
          <SquareSizeSelector
            squareSize={squareSize}
            setSquareSize={setSquareSize}
          />
        </div>
      </div>
      <Help />
    </>
  );
}

// Returns the number of adjacent mines to the square at position index
function getNumberOfAdjacentMines(index, mineIndexes, rows, cols) {
  return getNeighbours(index, rows, cols).filter((neighbourIndex) =>
    mineIndexes.includes(neighbourIndex)
  ).length;
}

// Returns the indexes of the neighbouring squares
function getNeighbours(index, rows, cols) {
  const top = index < cols ? -1 : index - cols;
  const left = index % cols === 0 ? -1 : index - 1;
  const right = index % cols === cols - 1 ? -1 : index + 1;
  const bottom = index >= rows * cols - cols ? -1 : index + cols;
  const topLeft = top === -1 || left === -1 ? -1 : top - 1;
  const topRight = top === -1 || right === -1 ? -1 : top + 1;
  const bottomLeft = bottom === -1 || left === -1 ? -1 : bottom - 1;
  const bottomRight = bottom === -1 || right === -1 ? -1 : bottom + 1;
  return [
    top,
    left,
    right,
    bottom,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  ].filter((neighbourIndex) => neighbourIndex !== -1);
}

// Returns a random int between 0 (inclusive) and max (exclusive)
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getCorrespondingImage(n) {
  switch (n) {
    case 0:
      return null;
    case 1:
      return <Number1 className="number" />;
    case 2:
      return <Number2 className="number" />;
    case 3:
      return <Number3 className="number" />;
    case 4:
      return <Number4 className="number" />;
    case 5:
      return <Number5 className="number" />;
    case 6:
      return <Number6 className="number" />;
    case 7:
      return <Number7 className="number" />;
    default:
      return <Number8 className="number" />;
  }
}
