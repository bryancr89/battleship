(function () {
    'use strict';

    angular
        .module('battleshipApp')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController(GameFactory) {
        var vm = this;
        vm.game = null;
        vm.gameStarted = false;
        vm.isPlaceShipsEnabled = true;
        vm.playerName = '';
        vm.maxShipsToAllocate = 0;

        function updateGame(game) {
            return vm.game = game;
        }

        /**
         * If the game is finished, update the game status.
         * @returns Boolean
         * */
        function isWinnerPlayed() {
            var gameFinished = vm.isGameFinished();
            if (gameFinished) {
                vm.game.endDate = new Date();
                vm.game.isPlayerWinner = vm.isPlayerWinner();
                return GameFactory.updateGame(vm.game)
                    .then(function() {
                        return gameFinished;
                    });
            }
            return gameFinished;
        }

        function computerPlay(gameFinished) {
            return gameFinished ? vm.game : GameFactory.askComputerToPlay(vm.game.id);
        }

        vm.isGameFinished = function isGameFinished() {
            return vm.game && (vm.game.computerShips === 0 || vm.game.playerShips === 0);
        };

        vm.isPlayerWinner = function isPlayerWinner() {
            return vm.game.computerShips === 0;
        };

        vm.getWinner = function getWinner() {
            var winner = vm.isPlayerWinner() ? vm.playerName : 'Computer';

            return winner + ' is the winner';
        };

        vm.canAllocateShips = function canAllocateShips() {
            return vm.maxShipsToAllocate > 0;
        };

        vm.canPlaceShips = function canPlaceShips(cell) {
            return !vm.isGameFinished() && cell.isAvailable && vm.canAllocateShips();
        };


        vm.placeShips = function placeShips(cell) {
            if (vm.canPlaceShips(cell)) {
                cell.isAvailable = false;
                vm.maxShipsToAllocate--;
            }
            if (vm.isPlaceShipsEnabled && vm.maxShipsToAllocate === 0) {
                vm.isPlaceShipsEnabled = false;
                GameFactory.updateGame(vm.game);
            }
        };

        /***
         * Validate if the player can play or not.
         * @attactPosition - Object that represent a cell of the board.
         * @returns Boolean
         */
        vm.canPlay = function canPlay(attackPosition) {
            return !(vm.isGameFinished() && vm.canAllocateShips()) && vm.game.playerTurn && attackPosition.isAvailable;
        };

        /***
         * Perform a player attack.
         * Then update the game.
         * Then validate if  the player won with the attack.
         * Then ask the computer to play.
         * Then update the game with the computer attack.
         * Then validate again if  the computer won with the attack.
         * @cell - Object that represent a cell of the shots board.
         * @returns Boolean
         */
        vm.attackShips = function attackShips(cell) {
            var attackPosition = vm.game.playerShotsBoard[cell.x][cell.y];
            if (vm.canPlay(attackPosition)) {
                GameFactory
                    .play(vm.game.id, {
                        x: cell.x,
                        y: cell.y
                    })
                    .then(updateGame)
                    .then(isWinnerPlayed)
                    .then(computerPlay)
                    .then(updateGame)
                    .then(isWinnerPlayed);
            }
        };

        vm.startGame = function startGame() {
            vm.gameStarted = true;
            GameFactory
                .createGame(vm.playerName)
                .then(updateGame)
                .then(function (game) {
                    vm.maxShipsToAllocate = game.playerShips;
                });
        };

        vm.playAgain = function playAgain() {
            vm.game = null;
            vm.gameStarted = false;
            vm.startGame();
        };
    }
})();
