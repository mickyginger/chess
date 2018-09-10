/* global Piece */
class Rook extends Piece { // eslint-disable-line no-unused-vars
  constructor(color) {
    super(color, [
      { row: -1, col: 0 },
      { row: 0, col: -1 },
      { row: 1, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2, isCastling: true, firstMoveOnly: true },
      { row: 0, col: -3, isCastling: true, firstMoveOnly: true }
    ]);
  }
}
