$(document).ready(function() {
  boardSetup();
  placePieces();
})

// ======================= Constants ========================

// Game board dimensions
const boardWidth = 11;
const boardHeight = 11;

// Special Spaces
const exclusionZone = [];
const kingSide = [];
const vikingSide = [];

// ========================= END ============================

function boardSetup() {
  let gameCellTemplate = $('#templates').find('#game_cell_template');
  let game = $('#vikinggame');

  for (let row = boardHeight; row >= 1; row--) {
    for (let column = 1; column <= boardWidth; column++) {
      let gameCell = $(gameCellTemplate).clone().attr('id', column + '_' + row);
      $(game).append(gameCell);
    }
  }
}

function placePieces() {

}
