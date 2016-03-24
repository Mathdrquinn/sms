(function($angular) {
  'use strict';

  $angular
    .module('app')
    .factory('FirebaseFactory', firebaseFactory);

  firebaseFactory.$inject = ['$firebaseObject', '$firebaseArray'];
  function firebaseFactory($firebaseObject, $firebaseArray) {
    var ref = new Firebase("https://studentmanagementsys.firebaseio.com");
    var getStudentsData = $firebaseArray(ref.child('students'));

    return {
      students: getStudentsData,
      student: student,
      saveStudentData: saveStudentData,
      deleteStudentData: deleteStudentData,
      addStudent: addStudent,
    }

    function student(id) {
      return $firebaseObject(ref.child('students').child(id));
    }

    function saveStudentData(student, successcb, errorcb) {
      return student.$save().then(successcb, errorcb);
    }

    function deleteStudentData(student, successcb, errorcb) {
      student.$remove().then(successcb, errorcb);
    }

    function addStudent(newStudent, successcb, errorcb) {
      getStudentsData.$add(newStudent).then(successcb, errorcb);
    }
  }

})(window.angular);
