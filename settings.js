// ======================= Constants ========================

// Game board dimensions
const boardWidth = 11;
const boardHeight = 11;

// Special Spaces, [x, y], top-left is [1, 1]
const escapeZone = [
  [1, 1],
  [1, boardHeight],
  [boardWidth, 1],
  [boardWidth, boardHeight]
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

const SETTINGS = {
  boardWidth: boardWidth,
  boardHeight: boardHeight,
  escapeZone: escapeZone,
  kingInitialLocation: kingInitialLocation,
  kingSideInitialLocation: kingSideInitialLocation,
  vikingSideInitialLocation: vikingSideInitialLocation
}

// ========================= END ============================

// module.exports = [
//   boardWidth,
//   boardHeight,
//   escapeZone,
//   kingInitialLocation,
//   kingSideInitialLocation,
//   vikingSideInitialLocation
// ]; 
