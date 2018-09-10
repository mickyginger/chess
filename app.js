// Generic piece class
class Piece {
  constructor(color, movement) {
    this.color = color;
    this.movement = movement;
  }
}

// Specfic pieces
class Pawn extends Piece {
  constructor(color) {
    super(color, [
      { row: color === 'white' ? 1 : -1, col: 0, restricted: true },
      { row: color === 'white' ? 1 : -1, col: 1, attackingOnly: true, restricted: true },
      { row: color === 'white' ? 1 : -1, col: -1, attackingOnly: true, restricted: true },
      { row: color === 'white' ? 2 : -2, col: 0, firstMoveOnly: true }
    ]);
  }
}

class Rook extends Piece {
  constructor(color) {
    super(color, [
      { row: -1, col: 0 },
      { row: 0, col: -1 },
      { row: 1, col: 0 },
      { row: 0, col: 1 }
    ]);
  }
}

class Knight extends Piece {
  constructor(color) {
    super(color, [
      { row: -1, col: -2, restricted: true },
      { row: -2, col: -1, restricted: true },
      { row: -1, col: 2, restricted: true },
      { row: -2, col: 1, restricted: true },
      { row: 1, col: -2, restricted: true },
      { row: 2, col: -1, restricted: true },
      { row: 1, col: 2, restricted: true },
      { row: 2, col: 1, restricted: true }
    ]);
  }
}

class Bishop extends Piece {
  constructor(color) {
    super(color, [
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 }
    ]);
  }
}

class Queen extends Piece {
  constructor(color) {
    super(color, [
      { row: -1, col: 0 },
      { row: 0, col: -1 },
      { row: 1, col: 0 },
      { row: 0, col: 1 },
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 }
    ]);
  }
}

class King extends Piece {
  constructor(color) {
    super(color, [
      { row: -1, col: 0, restricted: true },
      { row: 0, col: -1, restricted: true },
      { row: 1, col: 0, restricted: true },
      { row: 0, col: 1, restricted: true },
      { row: -1, col: -1, restricted: true },
      { row: -1, col: 1, restricted: true },
      { row: 1, col: -1, restricted: true },
      { row: 1, col: 1, restricted: true },
      { row: 0, col: 2, isCastling: true, firstMoveOnly: true }, // king side castle
      { row: 0, col: -3, isCastling: true, firstMoveOnly: true } // queen side castle
    ]);
  }
}

// Board class
class Board {
  constructor() {
    this.squares = [];
    this.generateSquares();
    this.assignPieces();
    this.player = 'white';
  }

  // Generate squres, each square is an object containing row, col and color
  generateSquares() {
    let i = 0, row = 0, col = 0, color = 'white';
    while(i < 64) {
      this.squares.push({ row, col, color });
      col++;
      i++;

      if(col === 8) col = 0;
      else color = color === 'white' ? 'black' : 'white';
      if(i % 8 === 0) row++;
    }
  }

  // Assign pieces to starting position on correct squares
  assignPieces() {
    this.squares = this.squares.map(square => {
      // pawns
      if(square.row === 1) square.piece = new Pawn('white');
      if(square.row === 6) square.piece = new Pawn('black');

      // rooks
      if(square.col === 0 || square.col === 7) {
        if(square.row === 0) square.piece = new Rook('white');
        if(square.row === 7) square.piece = new Rook('black');
      }

      // knights
      if(square.col === 1 || square.col === 6) {
        if(square.row === 0) square.piece = new Knight('white');
        if(square.row === 7) square.piece = new Knight('black');
      }

      // bishops
      if(square.col === 2 || square.col === 5) {
        if(square.row === 0) square.piece = new Bishop('white');
        if(square.row === 7) square.piece = new Bishop('black');
      }

      // queens
      if(square.col === 3) {
        if(square.row === 0) square.piece = new Queen('white');
        if(square.row === 7) square.piece = new Queen('black');
      }

      // kings
      if(square.col === 4) {
        if(square.row === 0) square.piece = new King('white');
        if(square.row === 7) square.piece = new King('black');
      }

      return square;
    });
  }

  // check if piece on squareFrom can move to squareTo from perspective of player
  canMove(squareFrom, squareTo, player=this.player) {
    if(!squareFrom.piece || squareFrom.piece.color !== player) return false;
    const indexFrom = this.squares.indexOf(squareFrom);
    const indexTo = this.squares.indexOf(squareTo);

    const squaresToCheck = [];

    let start = Math.min(indexFrom, indexTo);
    const end = Math.max(indexFrom, indexTo);

    let colDiff = squareTo.col - squareFrom.col;
    let rowDiff = squareTo.row - squareFrom.row;

    let move = squareFrom.piece.movement.find(movement => {
      if(movement.firstMoveOnly && squareFrom.piece.hasMoved) return false;
      return movement.row === rowDiff && movement.col === colDiff;
    });

    if(move && move.restricted) {
      const attackingMove = squareTo.piece && squareTo.piece.color !== squareFrom.piece.color;
      if(move.attackingOnly) return attackingMove && move.attackingOnly;
      return !!move;
    }

    // check that picece is moving horizontally, vertically or diagonally
    if(![0, -0, 1, -1, Infinity, -Infinity].includes(colDiff / rowDiff)) return false;

    rowDiff = rowDiff / Math.abs(rowDiff) || 0;
    colDiff = colDiff / Math.abs(colDiff) || 0;

    if(!move || !move.firstMoveOnly) {
      // re-evaluate move
      move = squareFrom.piece.movement.find(movement => {
        return movement.row === rowDiff && movement.col === colDiff;
      });
    }

    // firstly check that piece could move from one square to the next
    if(!move) return false;

    const indexDiff = Math.abs((rowDiff * 8) + colDiff);

    while(start <= end) {
      if(![indexFrom, indexTo].includes(start)) {
        squaresToCheck.push(this.squares[start]);
      }
      start+=indexDiff;
    }

    // check that no squares between start and end are occupied
    if(squaresToCheck.some(square => square.piece)) return false;

    // check that the end square is unoccupied, or occupied with an opposition piece
    return !squareTo.piece || squareTo.piece.color !== squareFrom.piece.color;
  }

  // move the piece from square with indexFrom to square with indexTo
  move(indexFrom, indexTo) {
    const squareFrom = this.squares[indexFrom];
    const squareTo = this.squares[indexTo];

    if(!this.canMove(squareFrom, squareTo)) return false;

    squareTo.piece = squareFrom.piece;
    delete squareFrom.piece;

    if(this.isPlayerInCheck()) {
      // player is in check, so undo the move
      squareFrom.piece = squareTo.piece;
      delete squareTo.piece;
      return false;
    }

    squareTo.piece.hasMoved = true; // flag that piece has moved

    this.player = this.player === 'white' ? 'black' : 'white';
    return true;
  }

  // check if player is in check
  // used to check whether player is in check at the start of their move
  isPlayerInCheck() {
    // get all the opponent's pieces
    const opponentSquares = this.squares.reduce((squares, square) => {
      if(square.piece && square.piece.color !== this.player) return squares.concat(square);
      return squares;
    }, []);

    // find the king
    const kingSquare = this.squares.find(square => {
      return square.piece instanceof King && square.piece.color === this.player;
    });

    // check if any of the pieces can move to the king's square
    return opponentSquares.some(square => this.canMove(square, kingSquare, square.piece.color));
  }
}

// initialize board
const board = new Board();

let indexFrom = null;
let indexTo = null;
let $board = null;
let $squares = null;

function movePiece(e) {
  const $square = $(e.currentTarget);
  const $piece = $square.find('.piece');

  if($piece.hasClass(board.player)) {
    indexFrom = $square.index();
    return false;
  }

  if(indexFrom) {
    indexTo = $square.index();

    if(board.move(indexFrom, indexTo)) {
      $square.empty();
      $square.append($squares.eq(indexFrom).find('.piece'));
    }
  }
}

// link game to DOM
function init() {

  $board = $('.board');

  // make the grid
  board.squares.forEach(square => {
    const $square = $('<div />', { class: `square ${square.color}` });
    square.piece && $square.append($('<i />', {
      class: `piece fas fa-chess-${square.piece.constructor.name.toLowerCase()} ${square.piece.color}`
    }));
    $board.append($square);
  });

  $squares = $board.find('.square');

  $board.on('click', '.square', movePiece);
}

$(init);
