/* global Piece */
class King extends Piece { // eslint-disable-line no-unused-vars
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
