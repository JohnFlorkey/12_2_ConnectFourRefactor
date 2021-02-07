/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Player {
  constructor(color, name) {
    this.color = color;
    this.name = name          // added this because I didn't think the cell board array assignment to a player instance was working
  }

}
class Game {
  constructor(width, height, color1, color2) {
    this.WIDTH = width ? width : 7; 
    this.HEIGHT = height ? height : 6;
    this.player1 = new Player(document.getElementById('player1Color').value, 'player1'); // I like the solution  of passing players in as objects instead of  
    this.player2 = new Player(document.getElementById('player2Color').value, 'player2'); // having the game constructor be responsible for them
    this.currPlayer = this.player1; // active player: 1 or 2
    this.board = []; // array of rows, each row is array of cells  (board[y][x])  // the solution moved this into the makeboard method, I don't see much advantage either way
    this.gameOver = false;
    this.reset();   // if game was in progress reset the html gameboard   // the solution moved this into the makeHTMLBoard method which I like as the reset function I wrote is no longer needed.
    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick);
    /*
    The solution binds handleClick function, I need to review this with Paritosh
    I believe I saw the result of not binding it as handleClick was getting called while attempting
    to restart the game.
    I used an arrow function in the definition of handleClick to get this set to the Game object.
    Bind would have been a better choice.
    */

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    // piece.classList.add(`p${this.currPlayer}`);
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    // solution removed the handleClick event listener from top here
  }

  /** handleClick: handle click of column top to play piece */

  handleClick = (evt) => {
    if(this.gameOver){
      return;
    }
    // get x from ID of clicked cell
    const x = evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.name;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.name} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }

  /*
  solution used arrow function to get this set correctly. I think moving it outside the checkForWin
  function achieved the same goal, but made the win method accessible outside the context of
  checkForWin which is not ideal.
  */
  win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.HEIGHT &&
        x >= 0 &&
        x < this.WIDTH &&
        this.board[y][x] === this.currPlayer.name
    );
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (this.win(horiz) || this.win(vert) || this.win(diagDR) || this.win(diagDL)) {
          return true;
        }
      }
    }
  }

  reset() {
    const table = document.getElementById('board');
    table.innerText = ''; // "erase" the HTML representation of the board
  }
}

const startBtn = document.getElementById('startGame');
startBtn.addEventListener('click', () => new Game(7,6));