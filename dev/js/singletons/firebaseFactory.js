(function($angular) {
  'use strict';

  console.log(4);

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

    function saveStudentData(student, cb) {
      var answer = confirm('are ya sure?');
      console.log('confirm', answer);

      if (answer) {
        debugger;
        student.$save().then(cb, cb);
      }
    }

    function deleteStudentData(student, cb) {
      student.$remove().then(cb, cb);
    }

    function addStudent(newStudent, cb) {
      getStudentsData.$add(newStudent).then(cb);
    }
  }

})(window.angular);
