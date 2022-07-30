class GameState {
  constructor() {
    this.KingClassName = 'kingUnit';
    this.EscapeZones = [];
  }

  initGameState() {
    this.turn = null;
    this.nonTurn = null;
    this.SIDES = { 
      Vikings: { 
        id: 'v', 
        Units: [], 
        className: 'vikingsUnit'
      }, 
      Kings: { 
        id: 'k', 
        Units: [], 
        className: 'kingsUnit'
      } 
    }; 
    this.King = null;
    this.Selection = { Selected: false, Unit: null };
    $("#vikinggame").empty();
  }

  placePieces() {
    // King side
    let kingLocation = this.placePiece(SETTINGS.kingInitialLocation, 'king.svg');
    this.King = new GameUnit(this.SIDES.Kings.id, kingLocation, true);
    this.SIDES.Kings.Units.push(this.King);

    for(let loc of SETTINGS.kingSideInitialLocation) {
      let unitLocation = this.placePiece(loc, 'knight.svg');
      this.SIDES.Kings.Units.push(new GameUnit(this.SIDES.Kings.id, unitLocation));
    } 

    // Viking side
    for (let loc of SETTINGS.vikingSideInitialLocation) {
      let unitLocation = this.placePiece(loc, 'viking.svg');
      this.SIDES.Vikings.Units.push(new GameUnit(this.SIDES.Vikings.id, unitLocation));
    }

    // Escape zone
    for (let loc of SETTINGS.escapeZone) {
      let zoneLocation = markEscapeZone(loc);
      this.EscapeZones.push(new EscapeZone(zoneLocation));
    }
  }

  placePiece(location, content) {
    let gamePieceClone = $('#templates').find('#game_piece_template').clone();
    let id = locationToID(location);

    $(gamePieceClone).removeAttr('id');
    $(gamePieceClone).attr('src', content);
    $(id).append(gamePieceClone);
    return id;
  }

  resetGameCell(locationId) {
    $(locationId).attr('class', 'gamecell');

    // check for locationId in EscapeZone
    if (EscapeZone.isEscapeZone(locationId)) {
      $(locationId).addClass(EscapeZone.className);
    }
  }

  refreshBoard() {
    // Disable all non turn units
    for (let unit of this.nonTurn.Units) {
      unit.updateGrid();
      unit.updateUnitClass(this.turn.id);
    }

    // Highlight moveable units
    // add onclick events to each moveable unit
    for (let unit of this.turn.Units) {
      unit.updateGrid();
      unit.updateUnitClass(this.turn.id, clickEvent);
    }
  }

  static traversable(unit, locationXY) {
    if ($(locationToID(locationXY)).hasClass('Unit')) return false; 
    if (!unit.isKing) return !$(locationToID(locationXY)).hasClass('escapeZone');

    return true;
  }

  releaseUnit(cellId, side) {
    let unitIndex = side.Units.findIndex(item => item.locationId === cellId);
    let unit = side.Units[unitIndex];
    side.Units.splice(unitIndex, 1);
    unit.release();  
  } 

  updateSelection(selectionState, selectedUnit) {
    this.Selection.Selected = selectionState;
    this.Selection.Unit = selectionState ? selectedUnit : null;
  }

  resetSelection() {
    if (this.Selection.Selected) $(this.Selection.Unit.getElement()).removeClass('selected');

    this.Selection.Selected = false;
    this.Selection.Unit = null;
  }

  boardSetup() {
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

  start() {
    this.initGameState();
    this.boardSetup();
    this.turn = this.SIDES.Vikings;
    this.nonTurn = this.SIDES.Kings;
    this.placePieces();
    this.refreshBoard();
  }

  nextTurn() {
    if (this.turn === this.SIDES.Vikings) {
      this.turn = this.SIDES.Kings;
      this.nonTurn = this.SIDES.Vikings;
    } else {
      this.turn = this.SIDES.Vikings;
      this.nonTurn = this.SIDES.Kings;
    }
    this.refreshBoard();
  }

  endTurn() {
    this.checkWinConditionSatisfied();
    this.nextTurn();
  }

  checkVikingWinCondition() {
    let x = this.King.getLocationXY()[0];
    let y = this.King.getLocationXY()[1];
    let surroundCount = 0;

    if (x === 1 || x === SETTINGS.boardWidth || y === 1 || y === SETTINGS.boardHeight) {
      surroundCount++;
    }
    
    if (typeMatch([x, y - 1], this.SIDES.Vikings)) surroundCount++;
    if (typeMatch([x, y + 1], this.SIDES.Vikings)) surroundCount++;
    if (typeMatch([x - 1, y], this.SIDES.Vikings)) surroundCount++;
    if (typeMatch([x + 1, y], this.SIDES.Vikings)) surroundCount++;

    return surroundCount == 4; 
  }

  checkKingWinCondition() {
    if (typeMatch($(this.King.getLocationXY()), EscapeZone)) {
      return true;
    }
    return false;
  }
  
  checkWinConditionSatisfied() {
    let win = null;
    if (this.turn === this.SIDES.Vikings) {
      win = this.checkVikingWinCondition();
    } else {
      win = this.checkKingWinCondition();
    }

    if (win) {
      console.log("Win condition reached!");
      // TODO: implement game reset and win text
      this.endGame(); 
    }
  }

  endGame() {
    for (let unit of this.SIDES.Kings.Units) {
      unit.disable();
    } 

    for (let unit of this.SIDES.Vikings.Units) {
      unit.disable();
    }
    this.start(); 
    // this.gameCompleteUI();
  }

}
