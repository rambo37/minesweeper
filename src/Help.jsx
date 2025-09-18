export function Help() {
  return (
    <div className="help">
      <h3>How to play</h3>
      <p>
        The objective of Minesweeper is to open all squares of the grid that do
        not contain mines. If you click on a square with a mine, the game ends
        as a loss. To begin a game, you must left-click on a square. The first
        square is guaranteed to be safe (assuming you are starting a fresh game
        rather than replaying the previous game).
      </p>
      <p>When you left-click on a square, there are 3 possibilities.</p>
      <ol>
        <li>The square contains a mine and the game ends.</li>
        <li>
          The square does not contain a mine but is adjacent to at least one
          mine. In this case, a number appears in the opened square indicating
          how many mines are adjacent to the square (including diagonals). Using
          this information, you may be able to deduce which neighbouring squares
          are safe/dangerous. However, sometimes it is necessary to make a
          guess. In such scenarios, it may be worth considering the probability
          of each square containing a mine.
        </li>
        <li>
          The square is not adjacent to any mines. This results in all adjacent
          squares being opened and if any of those squares also have no mines
          adjacent to them, then those are also opened. This can repeat many
          times, potentially opening up a significant portion of the grid.
        </li>
      </ol>
      <p>
        In order to keep track of which squares you suspect may contain mines
        (and to avoid accidentally opening them), you can right-click to flag
        that square. This will make it impossible for you to open the square by
        left-clicking unless you first right-click again to unflag the square.
        There is no restriction on how many flags you can place. Each flag you
        place results in the displayed number of mines remaining decreasing by
        1. This happens regardless of whether the flag was actually placed on a
        mine. Similarly, unflagging a square increments the displayed number of
        remaining mines by 1. Note that there is no need to flag squares that
        you suspect contain mines; the game can be won without flagging a single
        square.
      </p>
      <p>
        Underneath the grid you will find two blue buttons. The "New game"
        button starts a fresh game whereas the "Replay" button restarts the
        current game, retaining the mine positions. Furhter down, you will find
        three buttons that are used to change the difficulty. Increasing the
        difficulty increases the board size as well as the number of mines. If
        you are in the middle of a game, all of these buttons will first warn
        you if you want to proceed in order to prevent accidentally erasing your
        progress. Finally, there is a drop down menu that allows you to change
        the size of the squares of the grid. This can be used at any time
        without risk of losing game progress as it just resizes the squares.
      </p>
    </div>
  );
}
