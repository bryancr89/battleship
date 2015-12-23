var _ = require('underscore');
var uuid = require('uuid');
var Game = require('../models/game');
var utils = require('../utils');

var GRID_SIZE = 5;
var INITIAL_SHIPS = 5;

function createGameBoard() {
    var grid = [];
    for (var x = 0; x < GRID_SIZE; x++) {
        grid[x] = [];
        for (var y = 0; y < GRID_SIZE; y++) {
            grid[x][y] = {
                isAvailable: true,
                isDown: false,
                x: x,
                y: y
            };
        }
    }
    return grid;
}

function getRandom() {
    return Math.ceil(Math.random() * GRID_SIZE) - 1;
}

function getAvailablePosition(board) {
    var randomX, randomY;
    while (true) {
        randomX = getRandom();
        randomY = getRandom();
        if (board[randomX][randomY].isAvailable) {
            return {
                x: randomX,
                y: randomY
            };
        }
    }
}

function getInitializeComputerShips(computerShipsBoard) {
    var shipsAllocated,
        availablePosition;
    for (shipsAllocated = 0; shipsAllocated < INITIAL_SHIPS; shipsAllocated++) {
        availablePosition = getAvailablePosition(computerShipsBoard);
        computerShipsBoard[availablePosition.x][availablePosition.y].isAvailable = false;
    }
    return computerShipsBoard;
}

function getComputerAction(game) {
    return getAvailablePosition(game.computerShotsBoard);
}

function makePlayAction(game, action, myShotsFieldName, enemyShipsFieldName, remainingShips) {
    var shotsBoard = game[myShotsFieldName],
        enemyShipsBoard = game[enemyShipsFieldName];
    shotsBoard[action.x][action.y].isAvailable = false;
    if (!enemyShipsBoard[action.x][action.y].isAvailable) {
        enemyShipsBoard[action.x][action.y].isDown = true;
        shotsBoard[action.x][action.y].isDown = true;
        game[remainingShips]--;
    } else {
        enemyShipsBoard[action.x][action.y].isMissed = true;
    }
}

function play(gameStored, action) {
    var game = new Game(gameStored);
    if (action) { //The player played.
        makePlayAction(game, action, 'playerShotsBoard', 'computerShipsBoard', 'computerShips');
        game.playerTurn = false;
    } else { // The turn for the computer.
        action = getComputerAction(game);
        makePlayAction(game, action, 'computerShotsBoard', 'playerShipsBoard', 'playerShips');
        game.playerTurn = true;
    }

    return game;
}

function create(playerName) {
    var boardGame = createGameBoard(),
        computerInitialShips = getInitializeComputerShips(utils.clone(boardGame)),
        game = new Game({
            id: uuid.v1(),
            playerName: playerName,
            playerShipsBoard: utils.clone(boardGame),
            playerShotsBoard: utils.clone(boardGame),
            computerShipsBoard: computerInitialShips,
            computerShotsBoard: utils.clone(boardGame)
        });
    return game;
}


module.exports = {
    create: create,
    play: play
};
