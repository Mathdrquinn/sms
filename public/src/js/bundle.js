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

    console.log('mainController:', vm);
  }

})(window.angular);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiZGlyZWN0aXZlcy9zdHVkZW50RGlyZWN0aXZlLmpzIiwic2luZ2xldG9ucy9maXJlYmFzZUZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCRhbmd1bGFyKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBjb25zb2xlLmxvZygxKTtcblxuICAkYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcsIFsnZmlyZWJhc2UnXSlcblxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKCRhbmd1bGFyKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgY29uc29sZS5sb2coMik7XG5cbiAgJGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdtYWluQ29udHJvbGxlcicsIG1haW5Db250cm9sbGVyKVxuXG4gIG1haW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xuICBmdW5jdGlvbiBtYWluQ29udHJvbGxlcigkc2NvcGUpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0udGl0bGUgPSAnU3R1ZGVudCBNYW5hZ2VtZW50IFN5c3RlbSc7XG4gICAgdm0uYWJiclRpdGxlID0gJ1NNUyc7XG4gICAgdm0uZGVzY3JpcHRpb24gPSAnQW4gYXBwIGZvciBNYW5hZ2luZyBzdHVkZW50IGVucm9sbG1lbnQgYW5kIHN0dWRlbnQgZGF0YS4nO1xuICAgIHZtLnN0dWRlbnRNb2RhbCA9IGZhbHNlO1xuICAgIHZtLnRvZ2dsZVN0dWRlbnRNb2RhbCA9IHRvZ2dsZVN0dWRlbnRNb2RhbDtcbiAgICB2bS5uZXdTdHVkZW50TW9kYWwgPSBmYWxzZTtcbiAgICB2bS50b2dnbGVOZXdTdHVkZW50TW9kYWwgPSB0b2dnbGVOZXdTdHVkZW50TW9kYWw7XG4gICAgdm0udG9nZ2xlU3RhclN0dWRlbnQgPSB0b2dnbGVTdGFyU3R1ZGVudDtcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZVN0dWRlbnRNb2RhbChjaG9pY2UpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHZtLnN0dWRlbnRNb2RhbCA9IGNob2ljZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZtLnN0dWRlbnRNb2RhbCA9ICF2bS5zdHVkZW50TW9kYWw7XG4gICAgICB9XG5cbiAgICAgIGlmICh2bS5zdHVkZW50TW9kYWwpIHtcbiAgICAgICAgY29uc29sZS5sb2coJyRicm9hZGNhc3Qgb3BlbiBtb2RhbCcpO1xuICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgnb3Blbi1lZGl0LXN0dWRlbnQtbW9kYWwnLCB2bS5zdGFyU3R1ZGVudC4kaWQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdm0uc3R1ZGVudE1vZGFsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZU5ld1N0dWRlbnRNb2RhbChjaG9pY2UpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHZtLm5ld1N0dWRlbnRNb2RhbCA9IGNob2ljZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZtLm5ld1N0dWRlbnRNb2RhbCA9ICF2bS5uZXdTdHVkZW50TW9kYWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2bS5uZXdTdHVkZW50TW9kYWw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlU3RhclN0dWRlbnQoc3R1ZGVudERhdGEsIGNsZWFyKSB7XG4gICAgICBpZiAoY2xlYXIpIHtcbiAgICAgICAgZGVsZXRlIHZtLnN0YXJTdHVkZW50O1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXdTdGFyU3R1ZGVudCA9IHN0dWRlbnREYXRhO1xuXG4gICAgICBpZiAoIXZtLnN0YXJTdHVkZW50KSB7XG4gICAgICAgIHZtLnN0YXJTdHVkZW50ID0gbmV3U3RhclN0dWRlbnQ7XG4gICAgICB9IGVsc2UgaWYgKHZtLnN0YXJTdHVkZW50LiRpZCA9PT0gc3R1ZGVudERhdGEuJGlkKSB7XG4gICAgICAgIGRlbGV0ZSB2bS5zdGFyU3R1ZGVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZtLnN0YXJTdHVkZW50ID0gbmV3U3RhclN0dWRlbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2bS5zdGFyU3R1ZGVudDtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygnbWFpbkNvbnRyb2xsZXI6Jywgdm0pO1xuICB9XG5cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbigkYW5ndWxhcikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgY29uc29sZS5sb2coMyk7XG5cbiAgJGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5kaXJlY3RpdmUoJ3N0dWRlbnRUYWJsZScsIHN0dWRlbnRUYWJsZSlcbiAgICAuZGlyZWN0aXZlKCdzdHVkZW50RGV0YWlscycsIHN0dWRlbnREZXRhaWxzKVxuICAgIC5kaXJlY3RpdmUoJ3N0dWRlbnRNb2RhbCcsIHN0dWRlbnRNb2RhbClcbiAgICAuZGlyZWN0aXZlKCduZXdTdHVkZW50TW9kYWwnLCBuZXdTdHVkZW50TW9kYWwpO1xuXG4gIGZ1bmN0aW9uIHN0dWRlbnRUYWJsZSgpIHtcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgY29udHJvbGxlcjogc3R1ZGVudFRhYmxlQ29udHJvbGxlcixcbiAgICAgIGNvbnRyb2xsZXJBczogJ3RhYmxlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3RwbC9zdHVkZW50VGFibGUuaHRtbCcsXG4gICAgICByZXN0cmljdDogJ0UnXG4gICAgfTtcblxuICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICBzdHVkZW50VGFibGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnRmlyZWJhc2VGYWN0b3J5J107XG4gICAgZnVuY3Rpb24gc3R1ZGVudFRhYmxlQ29udHJvbGxlcigkcm9vdFNjb3BlLCBGaXJlYmFzZUZhY3RvcnkpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIHZtLnN0dWRlbnRzID0gRmlyZWJhc2VGYWN0b3J5LnN0dWRlbnRzO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0dWRlbnREZXRhaWxzKCkge1xuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgY29udHJvbGxlcjogc3R1ZGVudERldGFpbHNDb250cm9sbGVyLFxuICAgICAgY29udHJvbGxlckFzOiAnc3R1ZGVudERldGFpbHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvdHBsL3N0dWRlbnREZXRhaWxzLmh0bWwnLFxuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIG9wZW5Nb2RhbDogJz0nLFxuICAgICAgICBzdHVkZW50OiAnPSdcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIC8vIHN0dWRlbnREZXRhaWxzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJ107XG4gICAgZnVuY3Rpb24gc3R1ZGVudERldGFpbHNDb250cm9sbGVyKCkge1xuICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgY29uc29sZS5sb2coJ3N0dWRlbnREZXRhaWxzQ29udHJvbGxlcicsIHZtKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdHVkZW50TW9kYWwoKSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICBzY29wZToge1xuICAgICAgICBvcGVuOiAnPScsXG4gICAgICAgIHRvZ2dsZU1vZGFsOiAnPSdcbiAgICAgIH0sXG4gICAgICBjb250cm9sbGVyOiBzdHVkZW50TW9kYWxDb250cm9sbGVyLFxuICAgICAgY29udHJvbGxlckFzOiAnc3R1ZGVudE1vZGFsJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3RwbC9zdHVkZW50TW9kYWwuaHRtbCcsXG4gICAgICByZXN0cmljdDogJ0UnXG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIHN0dWRlbnRNb2RhbENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0ZpcmViYXNlRmFjdG9yeSddXG4gICAgZnVuY3Rpb24gc3R1ZGVudE1vZGFsQ29udHJvbGxlcigkc2NvcGUsIEZpcmViYXNlRmFjdG9yeSkge1xuICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgdm0uc3R1ZGVudEFjdGlvbnMgPSB7XG4gICAgICAgIHNhdmU6IEZpcmViYXNlRmFjdG9yeS5zYXZlU3R1ZGVudERhdGEsXG4gICAgICAgIGRlbGV0ZTogRmlyZWJhc2VGYWN0b3J5LmRlbGV0ZVN0dWRlbnREYXRhLFxuICAgICAgICBhZGQ6IEZpcmViYXNlRmFjdG9yeS5hZGRTdHVkZW50LFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgIH07XG5cbiAgICAgIGZ1bmN0aW9uIGNhbGxiYWNrKCkge1xuICAgICAgICB2bS50b2dnbGVNb2RhbChmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS4kb24oJ29wZW4tZWRpdC1zdHVkZW50LW1vZGFsJywgZnVuY3Rpb24oZXZlbnQsIHN0dWRlbnRJZCkge1xuICAgICAgICBjb25zb2xlLmxvZygnJG9uIG9wZW4gbW9kYWwnKVxuICAgICAgICB2bS5zdHVkZW50ID0gRmlyZWJhc2VGYWN0b3J5LnN0dWRlbnQoc3R1ZGVudElkKTtcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbmV3U3R1ZGVudE1vZGFsKCkge1xuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgb3BlbjogJz0nLFxuICAgICAgICB0b2dnbGVNb2RhbDogJz0nXG4gICAgICB9LFxuICAgICAgY29udHJvbGxlcjogbmV3U3R1ZGVudE1vZGFsQ29udHJvbGxlcixcbiAgICAgIGNvbnRyb2xsZXJBczogJ25ld1N0dWRlbnRNb2RhbCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3NyYy90cGwvbmV3U3R1ZGVudE1vZGFsLmh0bWwnLFxuICAgICAgcmVzdHJpY3Q6ICdFJ1xuICAgIH1cblxuICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICBuZXdTdHVkZW50TW9kYWxDb250cm9sbGVyLiRpbmplY3QgPSBbJ0ZpcmViYXNlRmFjdG9yeSddXG4gICAgZnVuY3Rpb24gbmV3U3R1ZGVudE1vZGFsQ29udHJvbGxlcihGaXJlYmFzZUZhY3RvcnkpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIHZtLnN0dWRlbnRBY3Rpb25zID0ge1xuICAgICAgICBzYXZlOiBGaXJlYmFzZUZhY3Rvcnkuc2F2ZVN0dWRlbnREYXRhLFxuICAgICAgICBkZWxldGU6IEZpcmViYXNlRmFjdG9yeS5kZWxldGVTdHVkZW50RGF0YSxcbiAgICAgICAgYWRkOiBGaXJlYmFzZUZhY3RvcnkuYWRkU3R1ZGVudCxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBjYWxsYmFjayhyZWYpIHtcbiAgICAgICAgdm0udG9nZ2xlTW9kYWwoZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygnbmV3U3R1ZGVudE1vZGFsQ29udHJvbGxlcjonLCB2bSk7XG4gICAgfVxuICB9XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iLCIoZnVuY3Rpb24oJGFuZ3VsYXIpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGNvbnNvbGUubG9nKDQpO1xuXG4gICRhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuZmFjdG9yeSgnRmlyZWJhc2VGYWN0b3J5JywgZmlyZWJhc2VGYWN0b3J5KTtcblxuICBmaXJlYmFzZUZhY3RvcnkuJGluamVjdCA9IFsnJGZpcmViYXNlT2JqZWN0JywgJyRmaXJlYmFzZUFycmF5J107XG4gIGZ1bmN0aW9uIGZpcmViYXNlRmFjdG9yeSgkZmlyZWJhc2VPYmplY3QsICRmaXJlYmFzZUFycmF5KSB7XG4gICAgdmFyIHJlZiA9IG5ldyBGaXJlYmFzZShcImh0dHBzOi8vc3R1ZGVudG1hbmFnZW1lbnRzeXMuZmlyZWJhc2Vpby5jb21cIik7XG4gICAgdmFyIGdldFN0dWRlbnRzRGF0YSA9ICRmaXJlYmFzZUFycmF5KHJlZi5jaGlsZCgnc3R1ZGVudHMnKSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3R1ZGVudHM6IGdldFN0dWRlbnRzRGF0YSxcbiAgICAgIHN0dWRlbnQ6IHN0dWRlbnQsXG4gICAgICBzYXZlU3R1ZGVudERhdGE6IHNhdmVTdHVkZW50RGF0YSxcbiAgICAgIGRlbGV0ZVN0dWRlbnREYXRhOiBkZWxldGVTdHVkZW50RGF0YSxcbiAgICAgIGFkZFN0dWRlbnQ6IGFkZFN0dWRlbnQsXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3R1ZGVudChpZCkge1xuICAgICAgcmV0dXJuICRmaXJlYmFzZU9iamVjdChyZWYuY2hpbGQoJ3N0dWRlbnRzJykuY2hpbGQoaWQpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYXZlU3R1ZGVudERhdGEoc3R1ZGVudCwgY2IpIHtcbiAgICAgIHZhciBhbnN3ZXIgPSBjb25maXJtKCdhcmUgeWEgc3VyZT8nKTtcbiAgICAgIGNvbnNvbGUubG9nKCdjb25maXJtJywgYW5zd2VyKTtcblxuICAgICAgaWYgKGFuc3dlcikge1xuICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgc3R1ZGVudC4kc2F2ZSgpLnRoZW4oY2IsIGNiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWxldGVTdHVkZW50RGF0YShzdHVkZW50LCBjYikge1xuICAgICAgc3R1ZGVudC4kcmVtb3ZlKCkudGhlbihjYiwgY2IpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFN0dWRlbnQobmV3U3R1ZGVudCwgY2IpIHtcbiAgICAgIGdldFN0dWRlbnRzRGF0YS4kYWRkKG5ld1N0dWRlbnQpLnRoZW4oY2IpO1xuICAgIH1cbiAgfVxuXG59KSh3aW5kb3cuYW5ndWxhcik7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
