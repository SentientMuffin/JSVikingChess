// ======================= Constants ========================

// Game board dimensions
const boardWidth = 11;
const boardHeight = 11;

// Special Spaces, [row, col]
const escapeZone = [
  [1, 1],
  [1, boardWidth],
  [boardHeight, 1],
  [boardHeight, boardWidth]
];

const kingInitialLocation = [6, 6];
const kingSideInitialLocation = [
  [4, 6], [8, 6], [6, 4], [6, 8],
  [7, 6], [5, 6], [6, 7], [6, 5],
  [7, 7], [5, 7], [7, 5], [5, 5]
];

const vikingSideInitialLocation = [
  [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [2, 6],
  [boardWidth, 4], [boardWidth, 5], [boardWidth, 6], [boardWidth, 7], [boardWidth, 8], [boardWidth - 1, 6],
  [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [6, 2],
  [4, boardHeight], [5, boardHeight], [6, boardHeight], [7, boardHeight], [8, boardHeight], [6, boardHeight - 1]
];

// ========================= END ============================

$(document).ready(function() {
  boardSetup();
  placePieces();
})

function boardSetup() {
  let game = $('#vikinggame');

  let gameCellTemplate = $('#templates').find('#game_cell_template');
  let gameRowTemplate = $('#templates').find('#game_row_template');

  for (let row = 1; row <= boardHeight; row++) {
    let gameRow = $(gameRowTemplate).clone().attr('id', 'row_' + row);
    $(game).append(gameRow);
    for (let column = 1; column <= boardWidth; column++) {
      let gameCell = $(gameCellTemplate).clone().attr('id', column + '_' + row);
      $(game).find('#row_' + row).append(gameCell);
    }
  }
}

function placePieces() {
  // King side
  placePiece(kingInitialLocation, 'king.svg');
  for(let loc of kingSideInitialLocation) {
    placePiece(loc, 'knight.svg');
  } 

  // Viking side
  for (let loc of vikingSideInitialLocation) {
    placePiece(loc, 'viking.svg');
  }

  // Escape zone
  for (let loc of escapeZone) {
    markEscapeZone(loc);
  }
}

function placePiece(location, content) {
  let gamePieceClone = $('#templates').find('#game_piece_template').clone();
  let id = locationToID(location);

  $(gamePieceClone).attr('src', content);
  $(id).append(gamePieceClone);
}

function markEscapeZone(location) {
  let id = locationToID(location);
  $(id).addClass('escapeZone');
}

function locationToID(location) {
  return '#' + location[0] + '_' + location[1];
}
