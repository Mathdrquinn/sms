(function($angular) {
  'use strict';
  console.log(2);

  $angular
    .module('app')
    .controller('mainController', mainController)

  function mainController() {
    var vm = this;

    vm.title = 'Student Management System';
    vm.abbrTitle = 'SMS';
    vm.description = 'An app for Managing student enrollment and student data.';
    vm.modal = true;
    vm.toggleStarStudent = toggleStarStudent;

    function toggleStarStudent(id, studentData, clear) {
      if (clear) {
        delete vm.starStudent;
        return;
      }

      var newStarStudent = studentData;
      newStarStudent.id = id;

      if (!vm.starStudent) {
        vm.starStudent = newStarStudent;
      } else if (vm.starStudent.id === id) {
        delete vm.starStudent;
      } else {
        vm.starStudent = newStarStudent;
      }

      console.log('vm.starStudent', vm.starStudent);

      return vm.starStudent;
    }
  }

})(window.angular);
