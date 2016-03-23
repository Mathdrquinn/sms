(function($angular) {
  'use strict';

  console.log(4);

  $angular
    .module('app')
    .factory('firebaseFactory', firebaseFactory);

  firebaseFactory.$inject = ['$firebaseObject'];
  function firebaseFactory($firebaseObject) {
    var ref = new Firebase("https://studentmanagementsys.firebaseio.com");

    return {
      students: $firebaseObject(ref.child('students'))
    }
  }

})(window.angular);
