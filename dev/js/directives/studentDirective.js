(function($angular) {
  'use strict';

  $angular
    .module('app')
    .directive('studentTable', studentTable)
    .directive('studentDetails', studentDetails)
    .directive('studentModal', studentModal)
    .directive('newStudentModal', newStudentModal)
    .directive('confirmationModal', confirmationModal);

  function studentTable() {
    var directive = {
      bindToController: true,
      controller: studentTableController,
      controllerAs: 'table',
      templateUrl: 'src/tpl/studentTable.html',
      restrict: 'E',
      replace: true,
      scope: {
        openDetails: '=',
        openNewStudentModal: '='
      }
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

      vm.confirmationModalEdit = false;
      vm.confirmationModalDelete = false;
      vm.submitDelete = submitDelete;
      vm.submitEdit = submitEdit;
      vm.studentActions = {
        save: FirebaseFactory.saveStudentData,
        delete: FirebaseFactory.deleteStudentData,
        add: FirebaseFactory.addStudent,
      };

      function submitDelete() {
        FirebaseFactory.deleteStudentData(vm.student, deleteSuccessCallback, errorCallback)
      }

      function submitEdit() {
        FirebaseFactory.saveStudentData(vm.student, editSuccessCallback, errorCallback)
      }

      function deleteSuccessCallback(ref) {
        vm.toggleModal(false);
        vm.confirmationModalDelete = false;
      }

      function editSuccessCallback(ref) {
        vm.toggleModal(false);
        vm.confirmationModalEdit = false;
      }

      function errorCallback(err) {
        return err;
      }

      $scope.$on('open-edit-student-modal', function(event, studentId) {
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

      vm.confirmationModal = false;
      vm.confirmationResponse = null;
      vm.studentActions = {
        save: FirebaseFactory.saveStudentData,
        delete: FirebaseFactory.deleteStudentData,
        add: FirebaseFactory.addStudent,
      };
      vm.submit = submit;

      function successCallback(ref) {
        vm.toggleModal(false);
        vm.confirmationModal = false;
        vm.modal = false;
        vm.student = {};
      }

      function errorCallback(err) {
        return;
      }

      function submit() {
        FirebaseFactory.addStudent(vm.student, successCallback, errorCallback);
      }
    }
  }

  function confirmationModal() {
    var directive = {
      bindToController: true,
      scope: {
        open: '=',
        proceed: '=',
        confirmText: '@',
        denyText: '@',
        text: '@'
      },
      controller: confirmationModalController,
      controllerAs: 'confirmationModal',
      templateUrl: 'src/tpl/confirmationModal.html',
      restrict: 'E'
    }

    return directive;

    function confirmationModalController() {
      var vm = this;
    }
  }
})(window.angular);
