(function($angular) {
  'use strict';

  console.log(3);

  $angular
    .module('app')
    .directive('studentTable', studentTable)
    .directive('studentDetails', studentDetails)
    .directive('studentModal', studentModal);

  function studentTable() {
    var directive = {
      controller: studentTableController,
      controllerAs: 'table',
      templateUrl: 'src/tpl/studentTable.html',
      restrict: 'E'
    };

    return directive;

    studentTableController.$inject = ['$rootScope', 'firebaseFactory'];
    function studentTableController($rootScope, firebaseFactory) {
      var vm = this;

      vm.students = firebaseFactory.students;
    }
  }

  function studentDetails() {
    var directive = {
      controller: studentDetailsController,
      controllerAs: 'studentDetails',
      templateUrl: 'src/tpl/studentDetails.html',
      restrict: 'E'
    };

    return directive;

    studentDetailsController.$inject = ['$rootScope'];
    function studentDetailsController($rootScope) {
      var vm = this;

      vm.works = 'Yatta!';
      vm.student = $rootScope.starStudent;
    }
  }

  function studentModal() {
    var directive = {
      bindToController: true,
      scope: {
        open: '=',
        modalStudent: '='
      },
      controller: studentModalController,
      controllerAs: 'studentModal',
      templateUrl: 'src/tpl/studentModal.html',
      restrict: 'E'
    }

    return directive;

    function studentModalController() {
      var vm = this;

      vm.works = 'modal is works!';
      debugger;
    }
  }
})(window.angular);
