// =============== Global Vars =================
// ================== END ====================

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


function startGame() {
  gameState.start();  
}

// ================== Run =====================

$(document).ready(function() {
  boardSetup();
  startGame();
})
