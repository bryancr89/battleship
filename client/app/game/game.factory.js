(function () {
    'use strict';
    var baseUrl = '/api';

    angular
        .module('battleshipApp')
        .factory('GameFactory', GameFactory);

    /** @ngInject */
    function GameFactory($http) {
        function cleanRequestHandler(request) {
            return request.data;
        }

        function getGameSettings() {
            return $http.get(baseUrl + '/games/settings')
                .then(cleanRequestHandler);
        }

        function createGame(playerName) {
            return $http
                .post(baseUrl + '/games', {
                    playerName: playerName
                })
                .then(cleanRequestHandler);
        }

        function updateGame(game) {
            return $http.put(baseUrl + '/games/' + game.id, game)
                .then(cleanRequestHandler);
        }

        function play(gameId, action) {
            return $http.post(baseUrl + '/games/' + gameId + '/play', action)
                .then(cleanRequestHandler);
        }

        function askComputerToPlay(gameId) {
            return $http.get(baseUrl + '/games/' + gameId + '/play')
                .then(cleanRequestHandler);
        }

        return {
            askComputerToPlay: askComputerToPlay,
            play: play,
            createGame: createGame,
            updateGame: updateGame,
            getGameSettings: getGameSettings
        }
    }
})();
