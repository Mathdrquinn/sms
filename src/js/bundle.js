(function($angular) {
  'use strict';

  console.log(1);

  $angular
    .module('app', ['firebase'])

})(window.angular);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiZGlyZWN0aXZlcy9zdHVkZW50RGlyZWN0aXZlLmpzIiwic2luZ2xldG9ucy9maXJlYmFzZUZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCRhbmd1bGFyKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBjb25zb2xlLmxvZygxKTtcblxuICAkYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcsIFsnZmlyZWJhc2UnXSlcblxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKCRhbmd1bGFyKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgY29uc29sZS5sb2coMik7XG5cbiAgJGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdtYWluQ29udHJvbGxlcicsIG1haW5Db250cm9sbGVyKVxuXG4gIGZ1bmN0aW9uIG1haW5Db250cm9sbGVyKCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS50aXRsZSA9ICdTdHVkZW50IE1hbmFnZW1lbnQgU3lzdGVtJztcbiAgICB2bS5hYmJyVGl0bGUgPSAnU01TJztcbiAgICB2bS5kZXNjcmlwdGlvbiA9ICdBbiBhcHAgZm9yIE1hbmFnaW5nIHN0dWRlbnQgZW5yb2xsbWVudCBhbmQgc3R1ZGVudCBkYXRhLic7XG4gICAgdm0ubW9kYWwgPSB0cnVlO1xuICAgIHZtLnRvZ2dsZVN0YXJTdHVkZW50ID0gdG9nZ2xlU3RhclN0dWRlbnQ7XG5cbiAgICBmdW5jdGlvbiB0b2dnbGVTdGFyU3R1ZGVudChpZCwgc3R1ZGVudERhdGEsIGNsZWFyKSB7XG4gICAgICBpZiAoY2xlYXIpIHtcbiAgICAgICAgZGVsZXRlIHZtLnN0YXJTdHVkZW50O1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXdTdGFyU3R1ZGVudCA9IHN0dWRlbnREYXRhO1xuICAgICAgbmV3U3RhclN0dWRlbnQuaWQgPSBpZDtcblxuICAgICAgaWYgKCF2bS5zdGFyU3R1ZGVudCkge1xuICAgICAgICB2bS5zdGFyU3R1ZGVudCA9IG5ld1N0YXJTdHVkZW50O1xuICAgICAgfSBlbHNlIGlmICh2bS5zdGFyU3R1ZGVudC5pZCA9PT0gaWQpIHtcbiAgICAgICAgZGVsZXRlIHZtLnN0YXJTdHVkZW50O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdm0uc3RhclN0dWRlbnQgPSBuZXdTdGFyU3R1ZGVudDtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coJ3ZtLnN0YXJTdHVkZW50Jywgdm0uc3RhclN0dWRlbnQpO1xuXG4gICAgICByZXR1cm4gdm0uc3RhclN0dWRlbnQ7XG4gICAgfVxuICB9XG5cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbigkYW5ndWxhcikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgY29uc29sZS5sb2coMyk7XG5cbiAgJGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5kaXJlY3RpdmUoJ3N0dWRlbnRUYWJsZScsIHN0dWRlbnRUYWJsZSlcbiAgICAuZGlyZWN0aXZlKCdzdHVkZW50RGV0YWlscycsIHN0dWRlbnREZXRhaWxzKVxuICAgIC5kaXJlY3RpdmUoJ3N0dWRlbnRNb2RhbCcsIHN0dWRlbnRNb2RhbCk7XG5cbiAgZnVuY3Rpb24gc3R1ZGVudFRhYmxlKCkge1xuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICBjb250cm9sbGVyOiBzdHVkZW50VGFibGVDb250cm9sbGVyLFxuICAgICAgY29udHJvbGxlckFzOiAndGFibGUnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvdHBsL3N0dWRlbnRUYWJsZS5odG1sJyxcbiAgICAgIHJlc3RyaWN0OiAnRSdcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIHN0dWRlbnRUYWJsZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICdmaXJlYmFzZUZhY3RvcnknXTtcbiAgICBmdW5jdGlvbiBzdHVkZW50VGFibGVDb250cm9sbGVyKCRyb290U2NvcGUsIGZpcmViYXNlRmFjdG9yeSkge1xuICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgdm0uc3R1ZGVudHMgPSBmaXJlYmFzZUZhY3Rvcnkuc3R1ZGVudHM7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3R1ZGVudERldGFpbHMoKSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgIGNvbnRyb2xsZXI6IHN0dWRlbnREZXRhaWxzQ29udHJvbGxlcixcbiAgICAgIGNvbnRyb2xsZXJBczogJ3N0dWRlbnREZXRhaWxzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3RwbC9zdHVkZW50RGV0YWlscy5odG1sJyxcbiAgICAgIHJlc3RyaWN0OiAnRSdcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIHN0dWRlbnREZXRhaWxzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJ107XG4gICAgZnVuY3Rpb24gc3R1ZGVudERldGFpbHNDb250cm9sbGVyKCRyb290U2NvcGUpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIHZtLndvcmtzID0gJ1lhdHRhISc7XG4gICAgICB2bS5zdHVkZW50ID0gJHJvb3RTY29wZS5zdGFyU3R1ZGVudDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdHVkZW50TW9kYWwoKSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICBzY29wZToge1xuICAgICAgICBvcGVuOiAnPScsXG4gICAgICAgIG1vZGFsU3R1ZGVudDogJz0nXG4gICAgICB9LFxuICAgICAgY29udHJvbGxlcjogc3R1ZGVudE1vZGFsQ29udHJvbGxlcixcbiAgICAgIGNvbnRyb2xsZXJBczogJ3N0dWRlbnRNb2RhbCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3NyYy90cGwvc3R1ZGVudE1vZGFsLmh0bWwnLFxuICAgICAgcmVzdHJpY3Q6ICdFJ1xuICAgIH1cblxuICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICBmdW5jdGlvbiBzdHVkZW50TW9kYWxDb250cm9sbGVyKCkge1xuICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgdm0ud29ya3MgPSAnbW9kYWwgaXMgd29ya3MhJztcbiAgICAgIGRlYnVnZ2VyO1xuICAgIH1cbiAgfVxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKCRhbmd1bGFyKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBjb25zb2xlLmxvZyg0KTtcblxuICAkYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmZhY3RvcnkoJ2ZpcmViYXNlRmFjdG9yeScsIGZpcmViYXNlRmFjdG9yeSk7XG5cbiAgZmlyZWJhc2VGYWN0b3J5LiRpbmplY3QgPSBbJyRmaXJlYmFzZU9iamVjdCddO1xuICBmdW5jdGlvbiBmaXJlYmFzZUZhY3RvcnkoJGZpcmViYXNlT2JqZWN0KSB7XG4gICAgdmFyIHJlZiA9IG5ldyBGaXJlYmFzZShcImh0dHBzOi8vc3R1ZGVudG1hbmFnZW1lbnRzeXMuZmlyZWJhc2Vpby5jb21cIik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3R1ZGVudHM6ICRmaXJlYmFzZU9iamVjdChyZWYuY2hpbGQoJ3N0dWRlbnRzJykpXG4gICAgfVxuICB9XG5cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
