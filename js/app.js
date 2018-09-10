/* global Board */
const board = new Board();

let indexFrom = null;
let indexTo = null;
let $board = null;
let $squares = null;

function updateBoard() {
  board.squares.forEach((square, i) => {
    const $square = $squares.eq(i);
    $square.empty();

    if(square.piece) {
      $square.append($('<i />', {
        class: `piece fas fa-chess-${square.piece.constructor.name.toLowerCase()} ${square.piece.color}`
      }));
    }
  });
}

function movePiece(e) {
  const $square = $(e.currentTarget);
  const $piece = $square.find('.piece');

  if($piece.hasClass(board.player)) {
    indexFrom = $square.index();
    return false;
  }

  if(indexFrom) {
    indexTo = $square.index();
    if(board.move(indexFrom, indexTo)) updateBoard();
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
