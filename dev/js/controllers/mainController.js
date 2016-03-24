(function($angular) {
  'use strict';

  $angular
    .module('app')
    .controller('mainController', mainController)

  mainController.$inject = ['$scope'];
  function mainController($scope) {
    var vm = this;

    vm.title = 'Student Management System';
    vm.abbrTitle = 'SMS';
    vm.description = 'An app for Managing student enrollment and student data.';
    vm.studentModal = false;
    vm.toggleStudentModal = toggleStudentModal;
    vm.newStudentModal = false;
    vm.toggleNewStudentModal = toggleNewStudentModal;
    vm.toggleStarStudent = toggleStarStudent;

    function toggleStudentModal(choice) {
      if (arguments.length) {
        vm.studentModal = choice;
      } else {
        vm.studentModal = !vm.studentModal;
      }

      if (vm.studentModal) {
        console.log('$broadcast open modal');
        $scope.$broadcast('open-edit-student-modal', vm.starStudent.$id);
      }

      return vm.studentModal;
    }

    function toggleNewStudentModal(choice) {
      if (arguments.length) {
        vm.newStudentModal = choice;
      } else {
        vm.newStudentModal = !vm.newStudentModal;
      }

      return vm.newStudentModal;
    }

    function toggleStarStudent(studentData, clear) {
      if (clear) {
        delete vm.starStudent;
        return;
      }

      var newStarStudent = studentData;

      if (!vm.starStudent) {
        vm.starStudent = newStarStudent;
      } else if (vm.starStudent.$id === studentData.$id) {
        delete vm.starStudent;
      } else {
        vm.starStudent = newStarStudent;
      }

      return vm.starStudent;
    }
  }

})(window.angular);
