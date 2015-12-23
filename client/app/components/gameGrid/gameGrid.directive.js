(function () {
    'use strict';

    angular
        .module('battleshipApp')
        .directive('gameGrid', GameGrid);

    /** @ngInject */
    function GameGrid() {
        var directive = {
            restrict: 'E',
            scope: {
                grid: '=',
                title: '@',
                cellClickHandler: '='
            },
            templateUrl: 'app/components/gameGrid/gameGrid.html',
            bindToController: true,
            controller: GameGridController,
            controllerAs: 'gameGrid'
        };

        /** @ngInject */
        function GameGridController() {
            var vm = this;

            vm.getStyles = function getStyles(cell) {
                if(cell.isDown) {
                    return 'is-down';
                }
                if(cell.isMissed) {
                    return 'is-missed';
                }
                return cell.isAvailable ? 'is-available' : 'is-not-available';
            };
        }
        return directive;
    }
})();
