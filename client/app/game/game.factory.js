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

        function askComputerToPlay(gameId) {
            return $http.get(baseUrl + '/games/' + gameId + '/play')
                .then(cleanRequestHandler);
        }

        function createGame(playerName) {
            return $http
                .post(baseUrl + '/games', {
                    playerName: playerName
                })
                .then(cleanRequestHandler);
        }

        function deleteGame(gameId) {
            return $http
                .delete(baseUrl + '/games/' + gameId)
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

        function getGames() {
            return $http.get(baseUrl + '/games?size=' + 10)
                .then(cleanRequestHandler);
        }

        return {
            askComputerToPlay: askComputerToPlay,
            play: play,
            createGame: createGame,
            deleteGame: deleteGame,
            updateGame: updateGame,
            getGames: getGames
        }
    }
})();
