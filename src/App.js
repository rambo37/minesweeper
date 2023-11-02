import { useState } from "react";
import { Board } from "./Board";
import { Timer } from "./Timer";
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

const EASY = {
  rows: 9,
  cols: 9,
  mines: 10,
};

const MEDIUM = {
  rows: 16,
  cols: 16,
  mines: 40,
};

const EXPERT = {
  rows: 16,
  cols: 30,
  mines: 99,
};

export default function App() {
  const [selectedMode, setSelectedMode] = useState(EASY);
  const [rows, setRows] = useState(selectedMode.rows);
  const [cols, setCols] = useState(selectedMode.cols);
  const size = rows * cols;
  const [squares, setSquares] = useState(Array(size).fill(<UnopenedSquare />));
  const [numberOfMines, setNumberOfMines] = useState(selectedMode.mines);
  const [minesRemaining, setMinesRemaining] = useState(selectedMode.mines);
  const [gameStarted, setGameStarted] = useState(false);
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
    if (!gameStarted) {
      setGameStarted(true);
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
    // Do nothing if the game has not started / has finished or if the square that
    // was right-clicked was already open
    if (!gameStarted || gameWon || gameLost || openedSquares[index]) return;

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

  // Starts the current game again - by not setting gameStarted to false and
  // mineIndexes to [], the mines will retain their positions.
  function replay() {
    if (!checkAndWarnForProgessLoss()) return;
    const numSquares = rows * cols;
    setSquares(Array(numSquares).fill(<UnopenedSquare />));
    setMinesRemaining(numberOfMines);
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
    return atLeastOneOpenedSquare() && !gameLost && !gameWon;
  }

  function atLeastOneOpenedSquare() {
    for (let i = 0; i < openedSquares.length; i++) {
      if (openedSquares[i]) return true;
    }
    return false;
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
        <div className={statusClass}>
          {status}
          <Timer seconds={seconds} setSeconds={setSeconds} paused={paused} />
        </div>
        <Board
          cols={cols}
          handleLeftClick={handleLeftClick}
          handleRightClick={handleRightClick}
          squares={squares}
          explodedSquareIndex={explodedSquareIndex}
          squareSize={squareSize}
        />
        <div className="game-controls">
          <button onClick={() => reset(rows, cols, numberOfMines)}>
            New game
          </button>
          <button onClick={replay} className="replay-button">
            Replay
          </button>
        </div>
        <div className="difficulty-controls">
          Select difficulty:
          <br />
          <button
            className={`easy-mode ${selectedMode === EASY ? "active" : ""}`}
            onClick={easyMode}
          >
            Easy<span>9x9</span>
          </button>
          <button
            className={`medium-mode ${selectedMode === MEDIUM ? "active" : ""}`}
            onClick={mediumMode}
          >
            Medium<span>16x16</span>
          </button>
          <button
            className={`expert-mode ${selectedMode === EXPERT ? "active" : ""}`}
            onClick={expertMode}
          >
            Expert<span>16x30</span>
          </button>
        </div>
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
      </div>
      <div className="help">
        <h3>How to play</h3>
        <p>
          The objective of Minesweeper is to open all squares of the grid that
          do not contain mines. If you click on a square with a mine, the game
          ends as a loss. To begin a game, you must left-click on a square. The
          first square is guaranteed to be safe (assuming you are starting a
          fresh game rather than replaying the previous game).
        </p>
        <p>When you left-click on a square, there are 3 possibilities.</p>
        <ol>
          <li>The square contains a mine and the game ends.</li>
          <li>
            The square does not contain a mine but is adjacent to at least one
            mine. In this case, a number appears in the opened square indicating
            how many mines are adjacent to the square (including diagonals).
            Using this information, you may be able to deduce which neighbouring
            squares are safe/dangerous. However, sometimes it is necessary to
            make a guess. In such scenarios, it may be worth considering the
            probability of each square containing a mine.
          </li>
          <li>
            The square is not adjacent to any mines. This results in all
            adjacent squares being opened and if any of those squares also have
            no mines adjacent to them, then those are also opened. This can
            repeat many times, potentially opening up a significant portion of
            the grid.
          </li>
        </ol>
        <p>
          In order to keep track of which squares you suspect may contain mines
          (and to avoid accidentally opening them), you can right-click to flag
          that square. This will make it impossible for you to open the square
          by left-clicking unless you first right-click again to unflag the
          square. There is no restriction on how many flags you can place. Each
          flag you place results in the displayed number of mines remaining
          decreasing by 1. This happens regardless of whether the flag was
          actually placed on a mine. Similarly, unflagging a square increments
          the displayed number of remaining mines by 1. Note that there is no
          need to flag squares that you suspect contain mines; the game can be
          won without flagging a single square.
        </p>
        <p>
          Underneath the grid you will find two blue buttons. The "New game"
          button starts a fresh game whereas the "Replay" button restarts the
          current game, retaining the mine positions. Furhter down, you will
          find three buttons that are used to change the difficulty. Increasing
          the difficulty increases the board size as well as the number of
          mines. If you are in the middle of a game, all of these buttons will
          first warn you if you want to proceed in order to prevent accidentally
          erasing your progress. Finally, there is a drop down menu that allows
          you to change the size of the squares of the grid. This can be used at
          any time without risk of losing game progress as it just resizes the
          squares.
        </p>
      </div>
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
