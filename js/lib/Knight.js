/* global Piece */
class Knight extends Piece { // eslint-disable-line no-unused-vars
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
