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
        vm.playerName = '';
        vm.maxShipsToAllocate = 0;

        vm.isGameFinished = function isGameFinished() {
            return vm.game && (vm.game.computerShips === 0 || vm.game.playerShips === 0);
        };

        vm.getWinner = function getWinner() {
            var winner = '';
            if (vm.game.computerShips === 0) {
                winner = vm.playerName;
            } else {
                winner = 'Computer';
            }
            return winner + ' is the winner';
        };

        vm.canAllocateShips = function canAllocateShips() {
            return vm.maxShipsToAllocate > 0;
        };

        vm.canPlaceShips = function canPlaceShips(cell) {
            return cell.isAvailable && vm.canAllocateShips();
        };

        vm.placeShips = function placeShips(cell) {
            if (vm.canPlaceShips(cell)) {
                cell.isAvailable = false;
                vm.maxShipsToAllocate--;
            }
            if (vm.maxShipsToAllocate === 0) {
                GameFactory.updateGame(vm.game);
            }
        };

        function updateGame(game) {
            return vm.game = game;
        }
        vm.canPlay = function canPlay(attackPosition) {
            return vm.game.playerTurn && attackPosition.isAvailable && !vm.canAllocateShips();
        };

        vm.attackShips = function attackShips(cell) {
            var attackPosition = vm.game.playerShotsBoard[cell.x][cell.y];
            if (vm.canPlay(attackPosition)) {
                GameFactory
                    .play(vm.game.id, {
                        x: cell.x,
                        y: cell.y
                    })
                    .then(updateGame)
                    .then(function () {
                        if(vm.isGameFinished()) {
                            vm.game.endDate = new Date();
                            return GameFactory.updateGame(vm.game);
                        }
                        return GameFactory
                            .askComputerToPlay(vm.game.id)
                            .then(updateGame);
                    });
            }
        };

        vm.startGame = function startGame() {
            vm.gameStarted = true;
            GameFactory
                .createGame(vm.playerName)
                .then(updateGame)
                .then(function(game) {
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
