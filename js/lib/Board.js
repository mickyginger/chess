/* global Pawn, Rook, Knight, Bishop, King, Queen */
class Board { // eslint-disable-line no-unused-vars
  constructor() {
    this.squares = [];
    this.moves = [];
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

  pathIsClear(indexFrom, indexTo, indexDiff) {
    let start = Math.min(indexFrom, indexTo);
    const end = Math.max(indexFrom, indexTo);

    const squaresToCheck = [];

    while(start <= end) {
      if(![indexFrom, indexTo].includes(start)) {
        squaresToCheck.push(this.squares[start]);
      }
      start+=indexDiff;
    }

    // check that no squares between start and end are occupied
    return squaresToCheck.every(square => !square.piece);
  }

  findValidMove(square, rowDiff, colDiff) {
    return square.piece.movement.find(movement => {
      if(movement.firstMoveOnly && square.piece.hasMoved) return false;
      return movement.row === rowDiff && movement.col === colDiff;
    });
  }

  isCastle(squareFrom, squareTo) {
    const colDiff = squareTo.col - squareFrom.col;
    const rowDiff = squareTo.row - squareFrom.row;

    const move = this.findValidMove(squareFrom, rowDiff, colDiff);

    return move && move.isCastling;
  }

  // check if piece on squareFrom can move to squareTo from perspective of player
  canMove(squareFrom, squareTo, player=this.player) {
    if(!squareFrom.piece || squareFrom.piece.color !== player) return false;
    const indexFrom = this.squares.indexOf(squareFrom);
    const indexTo = this.squares.indexOf(squareTo);

    let colDiff = squareTo.col - squareFrom.col;
    let rowDiff = squareTo.row - squareFrom.row;

    let move = this.findValidMove(squareFrom, rowDiff, colDiff);

    if(move && move.restricted) {
      const attackingMove = squareTo.piece && squareTo.piece.color !== squareFrom.piece.color;
      if(move.nonAttacking && attackingMove) return false;
      if(move.attackingOnly && !attackingMove) return false;
      return !!move;
    }

    // check that picece is moving horizontally, vertically or diagonally
    if(![0, -0, 1, -1, Infinity, -Infinity].includes(colDiff / rowDiff)) return false;

    rowDiff = rowDiff / Math.abs(rowDiff) || 0;
    colDiff = colDiff / Math.abs(colDiff) || 0;

    if(!move || !move.firstMoveOnly) move = this.findValidMove(squareFrom, rowDiff, colDiff);

    // firstly check that piece could move from one square to the next
    if(!move || move.restricted) return false;

    const indexDiff = Math.abs((rowDiff * 8) + colDiff);
    // check that the end square is unoccupied, or occupied with an opposition piece
    return this.pathIsClear(indexFrom, indexTo, indexDiff) &&
      (!squareTo.piece || squareTo.piece.color !== squareFrom.piece.color);
  }

  castle(kingSquare, rookSquare) {
    const kingFromIndex = this.squares.indexOf(kingSquare);
    const rookFromIndex = this.squares.indexOf(rookSquare);

    const direction = rookFromIndex % 8 === 0 ? 1 : -1;

    const kingToIndex = rookFromIndex + direction;
    const rookToIndex = rookFromIndex + direction * 2;

    if(
      kingSquare.piece.hasMoved || rookSquare.piece.hasMoved ||
      !this.pathIsClear(kingFromIndex, kingToIndex, 1) ||
      !this.pathIsClear(rookFromIndex, rookToIndex, 1)
    ) {
      return false;
    }

    this.squares[kingToIndex].piece = kingSquare.piece;
    this.squares[rookToIndex].piece = rookSquare.piece;
    delete kingSquare.piece;
    delete rookSquare.piece;

    if(this.playerInCheck()) {
      // player is in check, so undo the move
      kingSquare.piece = this.squares[kingToIndex].piece;
      rookSquare.piece = this.squares[rookToIndex].piece;
      delete this.squares[kingToIndex].piece;
      delete this.squares[rookToIndex].piece;
      return false;
    }

    this.squares[kingToIndex].hasMoved = true;
    this.squares[rookToIndex].hasMoved = true;
    return true;
  }

  // move the piece from square with indexFrom to square with indexTo
  move(indexFrom, indexTo) {
    const squareFrom = this.squares[indexFrom];
    const squareTo = this.squares[indexTo];

    if(!this.canMove(squareFrom, squareTo)) return false;

    if(this.isCastle(squareFrom, squareTo)) {
      const kingSquare = squareFrom;
      const rookSquare = this.squares[indexFrom - indexFrom%8 + (indexTo % 8 < 4 ? 0 : 7)];
      this.castle(kingSquare, rookSquare);
    } else {

      squareTo.piece = squareFrom.piece;
      delete squareFrom.piece;

      if(this.playerInCheck()) {
        // player is in check, so undo the move
        squareFrom.piece = squareTo.piece;
        delete squareTo.piece;
        return false;
      }

      squareTo.piece.hasMoved = true; // flag that piece has moved

      // promotion
      if(squareTo.piece instanceof Pawn && [0,7].includes(squareTo.row)) {
        squareTo.piece = new Queen(this.player);
      }
    }

    this.player = this.player === 'white' ? 'black' : 'white';
    return true;
  }

  // check if player is in check
  // used to check whether player is in check at the start of their move
  playerInCheck() {
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
    return opponentSquares.some(square => {
      return this.canMove(square, kingSquare, square.piece.color);
    });
  }
}
