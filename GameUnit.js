class GameUnit {
  constructor(sideId, locationId, isKing = false) {
    this.sideId = sideId;
    this.locationId = locationId;
    this.isKing = isKing;

    if (this.sideId === gameState.SIDES.Vikings.id) {
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
    // $(this.locationId).attr('class', 'gamecell');
    gameState.resetGameCell(this.locationId);
    for (let c of classList.split(" ")) {
      $('#' + newLocationId).addClass(c);
    }

    this.locationId = '#' + newLocationId;
    highLightTraversable(this, false);
    gameState.resetSelection();
  }

  release() {
    // $(this.locationId).attr('class', 'gamecell');
    gameState.resetGameCell(this.locationId);
    $(this.locationId).find('.gamepiece').remove();
  }

  updateUnitClass(turnId, clickEvent = null) {
    $(this.locationId).addClass('Unit');
    if (turnId === this.sideId) {
      $(this.locationId).removeClass('nonTurnUnits');
      $(this.locationId).addClass('turnUnits');
      $(this.locationId).on('click', this, clickEvent);
    } else {
      $(this.locationId).removeClass('turnUnits');
      $(this.locationId).addClass('nonTurnUnits');
      $(this.locationId).off('click');
    }
  }

  disable() {
    $(this.locationId).addClass('nonTurnUnits');
    $(this.locationId).off('click');
  }
}
