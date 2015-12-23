(function() {
  'use strict';

  angular
    .module('battleshipApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
