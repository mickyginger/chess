/* global Piece */
class Pawn extends Piece { // eslint-disable-line no-unused-vars
  constructor(color) {
    super(color, [
      { row: color === 'white' ? 1 : -1, col: 0, restricted: true, nonAttacking: true },
      { row: color === 'white' ? 1 : -1, col: 1, restricted: true, attackingOnly: true },
      { row: color === 'white' ? 1 : -1, col: -1, restricted: true, attackingOnly: true },
      { row: color === 'white' ? 2 : -2, col: 0, firstMoveOnly: true, nonAttacking: true }
    ]);
  }
}
