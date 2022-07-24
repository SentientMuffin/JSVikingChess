// =============== Global Vars =================

class GameState {
  constructor() {
    this.turn = null;
  }

  refreshBoard() {
    let nonTurnUnits = this.turn === SIDES.Vikings? KingUnits : VikingUnits; 
    let turnUnits = this.turn === SIDES.Vikings? VikingUnits : KingUnits;
    
    // Disable all non turn units
    for (let unit of nonTurnUnits) {
      unit.updateUnitClass(this.turn);
    }

    // Highlight moveable units
    // add onclick events to each moveable unit
    for (let unit of turnUnits) {
      unit.updateUnitClass(this.turn, clickEvent);
    }
  }

  static traversable(unit, locationXY) {
    if ($(locationToID(locationXY)).hasClass('Unit')) return false; 
    if (!unit.isKing) return !$(locationToID(locationXY)).hasClass('escapeZone');

    return true;
  }

  start() {
    this.turn = SIDES.Vikings;
    this.refreshBoard();
  }

  nextTurn() {
    if (this.turn === SIDES.Vikings) {
      this.turn = SIDES.Kings;
    } else {
      this.turn = SIDES.Vikings;
    }
    this.refreshBoard();
  }

  endTurn() {
    this.checkWinCondition();
    this.nextTurn();
  }

  checkVikingWinCondition() {
    let kingLocation = King.getLocationXY;
    // TODO implement win condition
  }

  checkKingWinCondition() {
    // TODO implement win condition
  }

  checkWinCondition() {
    let win = false;
    if (this.turn === SIDES.Vikings) {
      win = this.checkVikingWinCondition();
    } else {
      win = this.checkKingWinCondition();
    }

    if (win) {
      console.log("Win condition reached!");
      // TODO: implement game reset and win text
    }
  }
}

class GameUnit {
  constructor(side, locationId, isKing = false) {
    this.side = side;
    this.locationId = locationId;
    this.isKing = isKing;

    if (this.side === SIDES.Vikings) {
      this.styleClass = 'vikingsUnit';
    } else {
      this.styleClass = 'kingsUnit';
    }
    if (this.isKing) this.styleClass = 'kingUnit';

    this.updateGrid();
  }

  updateGrid() {
    $(this.locationId).addClass(this.styleClass);
  }
  
  getLocationXY() {
    let stringParts = this.locationId.substring(1).split("_");
    return [parseInt(stringParts[0]), parseInt(stringParts[1])];
  }

  getElement() {
    return $(this.locationId)[0];  
  }

  moveTo(newLocationId) {
    $(this.locationId).off('click');
    
    // Move unit image
    let unitElement = $(this.locationId).find('.gamepiece');
    $('#' + newLocationId).append(unitElement);

    // Move unit background
    let classList = $(this.locationId).attr('class');
    $(this.locationId).attr('class', 'gamecell');
    $('#' + newLocationId).attr('class', classList);

    this.locationId = '#' + newLocationId;
    highLightTraversable(this, false);
    resetSelection();
  }

  updateUnitClass(turn, clickEvent = null) {
    $(this.locationId).addClass('Unit');
    if (turn === this.side) {
      $(this.locationId).removeClass('nonTurnUnits');
      $(this.locationId).addClass('turnUnits');
      $(this.locationId).on('click', this, clickEvent);
    } else {
      $(this.locationId).removeClass('turnUnits');
      $(this.locationId).addClass('nonTurnUnits');
      $(this.locationId).off('click');
    }
  }
}

class EscapeZone {
  constructor(locationId) {
    this.locationId = locationId;
  }
}

const gameState = new GameState();
const SIDES = { Vikings: 'v', Kings: 'k' };
const VikingUnits = [];
const KingUnits = [];
const King = new GameUnit();
const EscapeZones = [];
const Selection = { Selected: false, Unit: null };
const HighLighted = [];

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

function placePieces() {
  // King side
  let kingLocation = placePiece(kingInitialLocation, 'king.svg');

  King.side = SIDES.Kings;
  King.locationId = kingLocation;
  King.isKing = true;
  King.styleClass = 'kingUnit';
  King.updateGrid();
  KingUnits.push(King);

  for(let loc of kingSideInitialLocation) {
    let unitLocation = placePiece(loc, 'knight.svg');
    KingUnits.push(new GameUnit(SIDES.Kings, unitLocation));
  } 

  // Viking side
  for (let loc of vikingSideInitialLocation) {
    let unitLocation = placePiece(loc, 'viking.svg');
    VikingUnits.push(new GameUnit(SIDES.Vikings, unitLocation));
  }

  // Escape zone
  for (let loc of escapeZone) {
    let zoneLocation = markEscapeZone(loc);
    EscapeZones.push(new EscapeZone(zoneLocation));
  }
}

function placePiece(location, content) {
  let gamePieceClone = $('#templates').find('#game_piece_template').clone();
  let id = locationToID(location);

  $(gamePieceClone).removeAttr('id');
  $(gamePieceClone).attr('src', content);
  $(id).append(gamePieceClone);
  return id;
}

function markEscapeZone(location) {
  let id = locationToID(location);
  $(id).addClass('escapeZone');
  return id;
}

function locationToID(location, location2 = null) {
  if (location2 !== null) return '#' + location + '_' + location2;
  return '#' + location[0] + '_' + location[1];
}


function clickEvent(event) {
  if (Selection.Selected && Selection.Unit?.getElement() !== event.currentTarget) return;

  $(event.currentTarget).toggleClass('selected');
  let selectionTrue = ($(event.currentTarget).hasClass('selected')); 

  Selection.Selected = selectionTrue;
  Selection.Unit = selectionTrue ? event.data : null;

  highLightTraversable(event.data, Selection.Selected);
}

function resetSelection() {
  $(Selection.Unit.getElement()).removeClass('selected');

  Selection.Selected = false;
  Selection.Unit = null;
}

function moveEvent(event) {
  let unit = Selection.Unit;
  unit.moveTo(event.currentTarget.id);

  // Update Turn
  gameState.endTurn();
}

function highLightTraversable(unit, highLight = true) {
  let position = unit.getLocationXY(); 
  let x = position[0]; 
  let y = position[1]; 

  if (!highLight) {
    for (let cell of HighLighted) {
      $(cell).removeClass('traversable');
      $(cell).off('click');
    }
    HighLighted.splice(0, HighLighted.length);
    return;
  }
  
  // Traverse Up
  while (y > 1 && GameState.traversable(unit, [x, y - 1])) {
    $(locationToID(x, y - 1)).addClass('traversable');
    HighLighted.push(locationToID(x, y - 1));
    y--;
  }
 
  // Traverse Down
  x = position[0]; 
  y = position[1]; 
  while (y < boardHeight && GameState.traversable(unit, [x, y + 1])) {
    $(locationToID(x, y + 1)).addClass('traversable');
    HighLighted.push(locationToID(x, y + 1));
    y++;
  }
  
  // Traverse Left
  x = position[0]; 
  y = position[1]; 
  while (x > 0 && GameState.traversable(unit, [x - 1, y])) {
    $(locationToID(x - 1, y)).addClass('traversable');
    HighLighted.push(locationToID(x - 1, y));
    x--;
  }
  
  // Traverse Right
  x = position[0]; 
  y = position[1]; 
  while (x < boardWidth && GameState.traversable(unit, [x + 1, y])) {
    $(locationToID(x + 1, y)).addClass('traversable');
    HighLighted.push(locationToID(x + 1, y));
    x++;
  }

  // HighLighted populated, add moveEvent to each
  for (let cell of HighLighted) {
    $(cell).on('click', moveEvent);
  }
}

function startGame() {
  gameState.start();  
}

// ================== Run =====================

$(document).ready(function() {
  boardSetup();
  placePieces();
  startGame();
})
