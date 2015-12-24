(function () {
    'use strict';

    angular
        .module('battleshipApp')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .state('leaderBoard', {
                url: '/leaderBoard',
                templateUrl: 'app/leaderboard/leaderboard.html',
                controller: 'LeaderBoardController',
                controllerAs: 'leaderBoard'
            });

        $urlRouterProvider.otherwise('/');
    }

})();
