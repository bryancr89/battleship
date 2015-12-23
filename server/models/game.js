var config = require('../config');
function Games(options) {
    this.id = options.id;
    this.playerName = options.playerName;
    this.playerShipsBoard = options.playerShipsBoard;
    this.playerShotsBoard = options.playerShotsBoard;
    this.computerShipsBoard = options.computerShipsBoard;
    this.computerShotsBoard = options.computerShotsBoard;
    this.status = config.status.inProgress;
    this.playerTurn = options.playerTurn || true;
    this.playerShips = options.playerShips || 5;
    this.computerShips = options.computerShips || 5;
    this.winner = config.winner;
    this.startDate = options.startDate || new Date();
    this.endDate = options.endDate || null;
}

module.exports = Games;
