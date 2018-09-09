class Piece {
  constructor(color, movement, restricted) {
    this.color = color;
    this.movement = movement;
    if(restricted) this.restricted = restricted;
  }
}

class Pawn extends Piece {
  constructor(color) {
    super(color, [
      { row: color === 'white' ? 1 : -1, col: 0 },
      { row: color === 'white' ? 1 : -1, col: 1, attackingOnly: true },
      { row: color === 'white' ? 1 : -1, col: -1, attackingOnly: true },
      { row: color === 'white' ? 2 : -2, col: 0 }
    ], true);
  }
}

class Rook extends Piece {
  constructor(color) {
    super(color, [
      { row: -1, col: 0 },
      { row: 0, col: -1 },
      { row: 1, col: 0 },
      { row: 0, col: 1 }
    ], false);
  }
}

class Knight extends Piece {
  constructor(color) {
    super(color, [
      { row: -1, col: -2 },
      { row: -2, col: -1 },
      { row: -1, col: 2 },
      { row: -2, col: 1 },
      { row: 1, col: -2 },
      { row: 2, col: -1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 }
    ], true);
  }
}

class Bishop extends Piece {
  constructor(color) {
    super(color, [
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 }
    ], false);
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
    ], false);
  }
}

class King extends Piece {
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
    ], true);
  }
}

class Board {
  constructor() {
    this.squares = [];
    this.generateSquares();
    this.assignPieces();
    this.player = 'white';
  }

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

  canMove(squareFrom, squareTo) {
    if(!squareFrom.piece || squareFrom.piece.color !== this.player) return false;
    const indexFrom = this.squares.indexOf(squareFrom);
    const indexTo = this.squares.indexOf(squareTo);
    // if movement is unrestricted keep going until we reach the edge of the board or a piece of the same color
    // get all squares between squareFrom and squareTo
    const squaresToCheck = [];

    let start = Math.min(indexFrom, indexTo);
    const end = Math.max(indexFrom, indexTo);

    let colDiff = squareTo.col - squareFrom.col;
    let rowDiff = squareTo.row - squareFrom.row;

    if(squareFrom.piece.restricted) {
      const move = squareFrom.piece.movement.find(movement => movement.row === rowDiff && movement.col === colDiff);
      const attackingMove = squareTo.piece && squareTo.piece.color !== squareFrom.piece.color;
      if(squareFrom.piece instanceof Pawn && move && attackingMove) return move.attackingOnly;
      return !!move;
    }
    // check that picece is moving horizontally, vertically or diagonally
    if(![0, -0, 1, -1, Infinity, -Infinity].includes(colDiff / rowDiff)) return false;

    colDiff = colDiff / Math.abs(colDiff) || 0;
    rowDiff = rowDiff / Math.abs(rowDiff) || 0;

    // firstly check that piece could move from one square to the next
    if(!squareFrom.piece.movement.find(movement => movement.row === rowDiff && movement.col === colDiff)) return false;

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

  move(indexFrom, indexTo) {
    console.log(`${this.player}'s move`);

    const squareFrom = this.squares[indexFrom];
    const squareTo = this.squares[indexTo];

    const playerInCheck = this.isPlayerInCheck();
    console.log(`${this.player} is in check:`, playerInCheck);

    if(!this.canMove(squareFrom, squareTo)) return false;
    console.log('can move');
    if(squareFrom.piece instanceof Pawn && squareFrom.piece.movement.length === 2){
      squareFrom.piece.movement.pop();
    }

    squareTo.piece = squareFrom.piece;
    delete squareFrom.piece;

    console.log('move successful');
    if(playerInCheck && this.isPlayerInCheck()) {
      // player is still in check, so undo the move
      console.log(`${this.player} is in check:`, playerInCheck);
      squareFrom.piece = squareTo.piece;
      delete squareTo.piece;
      console.log('reverting last move');
      return false;
    }

    this.player = this.player === 'white' ? 'black' : 'white';
    console.log(`${this.player} is in check:`, this.isPlayerInCheck());
    console.log('===========================================');
    return true;
  }

  // TODO cannot detect check yet... this.canMove is false when bishop CAN move to king square
  isPlayerInCheck() {
    console.log('isPlayerInCheck', this.player);
    // get all the opponent's pieces
    const opponentSquares = this.squares.reduce((squares, square) => {
      if(square.piece && square.piece.color !== this.player) return squares.concat(square);
      return squares;
    }, []);

    // find the king
    const kingSquare = this.squares.find(square => {
      return square.piece instanceof King && square.piece.color === this.player;
    });

    console.log(kingSquare);

    // check if any of the pieces can move to the king's square
    return opponentSquares.some(square => this.canMove(square, kingSquare));
  }
}

const board = new Board();
board.move(11, 27);
board.move(52, 36);
board.move(27, 36);
board.move(61, 25);
console.log('CAN TAKE KING', board.canMove(board.squares[25], board.squares[4]));

$(() => {
  let indexFrom = null;
  let indexTo = null;
  // make the grid
  const $board = $('.board');
  board.squares.forEach(square => {
    const $square = $('<div />', { class: `square ${square.color}` });
    if(square.piece) $square.append($('<i />', {
      class: `piece fas fa-chess-${square.piece.constructor.name.toLowerCase()} ${square.piece.color}`
    }));
    $board.append($square);
  });

  const $squares = $board.find('.square');

  $board.on('click', '.square', e => {
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
  });
});