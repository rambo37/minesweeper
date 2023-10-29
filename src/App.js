import { useState } from "react";
import { Square } from "./Square";
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

export default function Board() {
  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(9);
  const [squares, setSquares] = useState(Array(81).fill(<UnopenedSquare />));
  const [numberOfMines, setNumberOfMines] = useState(10);
  const [minesRemaining, setMinesRemaining] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [mineIndexes, setMineIndexes] = useState([]);
  const [openedSquares, setOpenedSquares] = useState(Array(81).fill(false));
  const [flaggedSquares, setflaggedSquares] = useState(Array(81).fill(false));

  function handleLeftClick(index) {
    if (gameWon || gameLost) return;

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
      setSquares(nextSquares);
      setGameLost(true);
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

    // Check if the game has been won after one or more squares were opened by
    // this method
    let unopenedSquare = false;
    for (let i = 0; i < nextOpenedSquares.length; i++) {
      // If the square is not a mine and it is not opened, then we have an
      // unopened square
      if (!mineIndexes.includes(i) && !nextOpenedSquares[i]) {
        unopenedSquare = true;
        break;
      }
    }
    // The game has been won if there are no unopened squares remaining
    setGameWon(!unopenedSquare);
    setSquares(nextSquares);
    setOpenedSquares(nextOpenedSquares);
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

  function easyMode() {
    reset(9, 9, 10);
  }

  function mediumMode() {
    reset(16, 16, 40);
  }

  function expertMode() {
    reset(16, 30, 99);
  }

  // Starts a fresh game - the parameters are for the new game.
  function reset(numRows, numCols, numMines) {
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
  }

  // Starts the current game again - by not setting gameStarted to false and
  // mineIndexes to [], the mines will retain their positions.
  function replay() {
    const numSquares = rows * cols;
    setSquares(Array(numSquares).fill(<UnopenedSquare />));
    setMinesRemaining(numberOfMines);
    setGameWon(false);
    setGameLost(false);
    setOpenedSquares(Array(numSquares).fill(false));
    setflaggedSquares(Array(numSquares).fill(false));
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
        <div className={statusClass}>{status}</div>
        <div
          className="board"
          style={{ gridTemplateColumns: `repeat(${cols}, max-content)` }}
        >
          {squares.map((value, index) => {
            return (
              <Square
                key={`square${index}`}
                value={value}
                onLeftClick={() => handleLeftClick(index)}
                onRightClick={(event) => handleRightClick(event, index)}
              />
            );
          })}
        </div>
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
          <button className="easy-mode" onClick={easyMode}>
            Easy<span>9x9</span>
          </button>
          <button className="medium-mode" onClick={mediumMode}>
            Medium<span>16x16</span>
          </button>
          <button className="expert-mode" onClick={expertMode}>
            Expert<span>16x30</span>
          </button>
        </div>
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
      return <Number1 />;
    case 2:
      return <Number2 />;
    case 3:
      return <Number3 />;
    case 4:
      return <Number4 />;
    case 5:
      return <Number5 />;
    case 6:
      return <Number6 />;
    case 7:
      return <Number7 />;
    default:
      return <Number8 />;
  }
}
