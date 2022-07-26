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
  if (gameState.Selection.Selected && gameState.Selection.Unit?.getElement() !== event.currentTarget) return;

  $(event.currentTarget).toggleClass('selected');
  let selectionTruth = ($(event.currentTarget).hasClass('selected')); 

  gameState.updateSelection(selectionTruth, event.data);
  highLightTraversable(event.data, selectionTruth);
}

function moveEvent(event) {
  let unit = gameState.Selection.Unit;
  unit.moveTo(event.currentTarget.id);
  checkCapture(unit);

  // Update Turn
  gameState.endTurn();
}

function checkCapture(unit) {
  // check for captures as a result of the update of unit: GameUnit
  let x = unit.getLocationXY()[0];
  let y = unit.getLocationXY()[1];
  
  // check Up
  checkCaptureForDirection(x, 0, y - 1, -1);
  
  // check Down
  checkCaptureForDirection(x, 0, y + 1, 1);

  // check Left
  checkCaptureForDirection(x - 1, -1, y, 0);

  // check Right
  checkCaptureForDirection(x + 1, +1, y, 0);
}

function checkCaptureForDirection(x, xChange, y, yChange) {
  // start with [x, y] , if there is a unit of opposite side, continue checking
  let capture = gameState.nonTurn;
  let finisher = gameState.turn
  let captured = [];

  while ($(locationToID(x, y)).hasClass(capture.className)) {
    captured.push(locationToID(x, y));
    x += xChange;
    y += yChange;
  }

  if (captured.length == 0) {
    console.log('No captures in the direction: [' + xChange + ', ' + yChange + ']');
    return;
  }
  // if captured is at least 1, x,y would have been incremented to when it is not sideToCapture
  if ($(locationToID(x, y))?.hasClass(finisher.className)) {
    for (let unit of captured) {
      gameState.releaseUnit(unit, capture);
    }
  }
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
