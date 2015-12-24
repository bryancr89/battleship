(function () {
    'use strict';

    angular
        .module('battleshipApp')
        .controller('LeaderBoardController', LeaderBoardController);

    /** @ngInject */
    function LeaderBoardController(GameFactory, moment) {
        var vm = this;

        vm.deleteGame = function (index) {
            GameFactory
                .deleteGame(vm.games[index].id)
                .then(function () {
                    vm.games.splice(index, 1);
                });
        };

        GameFactory.getGames()
            .then(function (games) {
                vm.games = games.map(function (game) {
                    var duration = moment.duration(game.duration);
                    game.duration = duration.hours() + 'h ' + duration.minutes() + 'm ' + duration.seconds() + 's';
                    return game;
                });
            });
    }
})();
