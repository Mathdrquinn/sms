(function($angular) {
  'use strict';

  console.log(3);

  $angular
    .module('app')
    .directive('studentTable', studentTable)
    .directive('studentDetails', studentDetails)
    .directive('studentModal', studentModal)
    .directive('newStudentModal', newStudentModal);

  function studentTable() {
    var directive = {
      controller: studentTableController,
      controllerAs: 'table',
      templateUrl: 'src/tpl/studentTable.html',
      restrict: 'E'
    };

    return directive;

    studentTableController.$inject = ['$rootScope', 'FirebaseFactory'];
    function studentTableController($rootScope, FirebaseFactory) {
      var vm = this;

      vm.students = FirebaseFactory.students;
    }
  }

  function studentDetails() {
    var directive = {
      bindToController: true,
      controller: studentDetailsController,
      controllerAs: 'studentDetails',
      templateUrl: 'src/tpl/studentDetails.html',
      restrict: 'E',
      scope: {
        openModal: '=',
        student: '='
      }
    };

    return directive;

    // studentDetailsController.$inject = ['$rootScope'];
    function studentDetailsController() {
      var vm = this;

      console.log('studentDetailsController', vm);
    }
  }

  function studentModal() {
    var directive = {
      bindToController: true,
      scope: {
        open: '=',
        toggleModal: '='
      },
      controller: studentModalController,
      controllerAs: 'studentModal',
      templateUrl: 'src/tpl/studentModal.html',
      restrict: 'E'
    }

    return directive;

    studentModalController.$inject = ['$scope', 'FirebaseFactory']
    function studentModalController($scope, FirebaseFactory) {
      var vm = this;

      vm.studentActions = {
        save: FirebaseFactory.saveStudentData,
        delete: FirebaseFactory.deleteStudentData,
        add: FirebaseFactory.addStudent,
        callback: callback
      };

      function callback() {
        vm.toggleModal(false);
      }

      $scope.$on('open-edit-student-modal', function(event, studentId) {
        console.log('$on open modal')
        vm.student = FirebaseFactory.student(studentId);
      })
    }
  }

  function newStudentModal() {
    var directive = {
      bindToController: true,
      scope: {
        open: '=',
        toggleModal: '='
      },
      controller: newStudentModalController,
      controllerAs: 'newStudentModal',
      templateUrl: 'src/tpl/newStudentModal.html',
      restrict: 'E'
    }

    return directive;

    newStudentModalController.$inject = ['FirebaseFactory']
    function newStudentModalController(FirebaseFactory) {
      var vm = this;

      vm.studentActions = {
        save: FirebaseFactory.saveStudentData,
        delete: FirebaseFactory.deleteStudentData,
        add: FirebaseFactory.addStudent,
        callback: callback
      };

      function callback(ref) {
        vm.toggleModal(false);
      }

      console.log('newStudentModalController:', vm);
    }
  }
})(window.angular);
