var uuid = require('uuid');
var GRID_SIZE = 5;
var INITIAL_SHIPS = 5;

function createGameGrid() {
	var grid = [];
	for (var i = 0; i < GRID_SIZE; i++) {
		grid[i] = [];
		for (var j = 0; j < GRID_SIZE; j++) {
			grid[i][j] = 0;
		}
	}
	return grid;
}

function getRandom() {
	return Math.ceil(Math.random() * GRID_SIZE) - 1;
}

function getAvailablePosition(computerShipsGrid) {
	var randomX, randomY;

	while(true) {
		randomX = getRandom();
		randomY = getRandom();
		if (computerShipsGrid[randomX][randomY] === 0) {
			return {
				x: randomX,
				y: randomY
			};
		}
	}
}

function initializeComputerShips(computerShipsGrid) {
	var shipsAllocated,
		availablePosition;
	for(shipsAllocated = 0; shipsAllocated < INITIAL_SHIPS; shipsAllocated++) {
		availablePosition = getAvailablePosition(computerShipsGrid);
		computerShipsGrid[availablePosition.x][availablePosition.y] = 1;
	}
	return computerShipsGrid;
}

function create() {
	var gridGame = createGameGrid();
	return {
		id: uuid.v1(),
		playerShipsGrid: gridGame,
		playerShotsGrid: gridGame,
		computerShipsGrid: gridGame,
		computerShotsGrid: gridGame
	};
}

module.exports = {
	create: create,
	initializeComputerShips: initializeComputerShips
};