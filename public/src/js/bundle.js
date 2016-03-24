(function($angular) {
  'use strict';

  $angular
    .module('app', ['firebase'])

})(window.angular);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwic2luZ2xldG9ucy9maXJlYmFzZUZhY3RvcnkuanMiLCJkaXJlY3RpdmVzL3N0dWRlbnREaXJlY3RpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkYW5ndWxhcikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgJGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnLCBbJ2ZpcmViYXNlJ10pXG5cbn0pKHdpbmRvdy5hbmd1bGFyKTtcbiIsIihmdW5jdGlvbigkYW5ndWxhcikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgJGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdtYWluQ29udHJvbGxlcicsIG1haW5Db250cm9sbGVyKVxuXG4gIG1haW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZSddO1xuICBmdW5jdGlvbiBtYWluQ29udHJvbGxlcigkc2NvcGUpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0udGl0bGUgPSAnU3R1ZGVudCBNYW5hZ2VtZW50IFN5c3RlbSc7XG4gICAgdm0uYWJiclRpdGxlID0gJ1NNUyc7XG4gICAgdm0uZGVzY3JpcHRpb24gPSAnQW4gYXBwIGZvciBNYW5hZ2luZyBzdHVkZW50IGVucm9sbG1lbnQgYW5kIHN0dWRlbnQgZGF0YS4nO1xuICAgIHZtLnN0dWRlbnRNb2RhbCA9IGZhbHNlO1xuICAgIHZtLnRvZ2dsZVN0dWRlbnRNb2RhbCA9IHRvZ2dsZVN0dWRlbnRNb2RhbDtcbiAgICB2bS5uZXdTdHVkZW50TW9kYWwgPSBmYWxzZTtcbiAgICB2bS50b2dnbGVOZXdTdHVkZW50TW9kYWwgPSB0b2dnbGVOZXdTdHVkZW50TW9kYWw7XG4gICAgdm0udG9nZ2xlU3RhclN0dWRlbnQgPSB0b2dnbGVTdGFyU3R1ZGVudDtcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZVN0dWRlbnRNb2RhbChjaG9pY2UpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHZtLnN0dWRlbnRNb2RhbCA9IGNob2ljZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZtLnN0dWRlbnRNb2RhbCA9ICF2bS5zdHVkZW50TW9kYWw7XG4gICAgICB9XG5cbiAgICAgIGlmICh2bS5zdHVkZW50TW9kYWwpIHtcbiAgICAgICAgY29uc29sZS5sb2coJyRicm9hZGNhc3Qgb3BlbiBtb2RhbCcpO1xuICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgnb3Blbi1lZGl0LXN0dWRlbnQtbW9kYWwnLCB2bS5zdGFyU3R1ZGVudC4kaWQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdm0uc3R1ZGVudE1vZGFsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvZ2dsZU5ld1N0dWRlbnRNb2RhbChjaG9pY2UpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHZtLm5ld1N0dWRlbnRNb2RhbCA9IGNob2ljZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZtLm5ld1N0dWRlbnRNb2RhbCA9ICF2bS5uZXdTdHVkZW50TW9kYWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2bS5uZXdTdHVkZW50TW9kYWw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlU3RhclN0dWRlbnQoc3R1ZGVudERhdGEsIGNsZWFyKSB7XG4gICAgICBpZiAoY2xlYXIpIHtcbiAgICAgICAgZGVsZXRlIHZtLnN0YXJTdHVkZW50O1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXdTdGFyU3R1ZGVudCA9IHN0dWRlbnREYXRhO1xuXG4gICAgICBpZiAoIXZtLnN0YXJTdHVkZW50KSB7XG4gICAgICAgIHZtLnN0YXJTdHVkZW50ID0gbmV3U3RhclN0dWRlbnQ7XG4gICAgICB9IGVsc2UgaWYgKHZtLnN0YXJTdHVkZW50LiRpZCA9PT0gc3R1ZGVudERhdGEuJGlkKSB7XG4gICAgICAgIGRlbGV0ZSB2bS5zdGFyU3R1ZGVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZtLnN0YXJTdHVkZW50ID0gbmV3U3RhclN0dWRlbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2bS5zdGFyU3R1ZGVudDtcbiAgICB9XG4gIH1cblxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKCRhbmd1bGFyKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAkYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmZhY3RvcnkoJ0ZpcmViYXNlRmFjdG9yeScsIGZpcmViYXNlRmFjdG9yeSk7XG5cbiAgZmlyZWJhc2VGYWN0b3J5LiRpbmplY3QgPSBbJyRmaXJlYmFzZU9iamVjdCcsICckZmlyZWJhc2VBcnJheSddO1xuICBmdW5jdGlvbiBmaXJlYmFzZUZhY3RvcnkoJGZpcmViYXNlT2JqZWN0LCAkZmlyZWJhc2VBcnJheSkge1xuICAgIHZhciByZWYgPSBuZXcgRmlyZWJhc2UoXCJodHRwczovL3N0dWRlbnRtYW5hZ2VtZW50c3lzLmZpcmViYXNlaW8uY29tXCIpO1xuICAgIHZhciBnZXRTdHVkZW50c0RhdGEgPSAkZmlyZWJhc2VBcnJheShyZWYuY2hpbGQoJ3N0dWRlbnRzJykpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0dWRlbnRzOiBnZXRTdHVkZW50c0RhdGEsXG4gICAgICBzdHVkZW50OiBzdHVkZW50LFxuICAgICAgc2F2ZVN0dWRlbnREYXRhOiBzYXZlU3R1ZGVudERhdGEsXG4gICAgICBkZWxldGVTdHVkZW50RGF0YTogZGVsZXRlU3R1ZGVudERhdGEsXG4gICAgICBhZGRTdHVkZW50OiBhZGRTdHVkZW50LFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0dWRlbnQoaWQpIHtcbiAgICAgIHJldHVybiAkZmlyZWJhc2VPYmplY3QocmVmLmNoaWxkKCdzdHVkZW50cycpLmNoaWxkKGlkKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2F2ZVN0dWRlbnREYXRhKHN0dWRlbnQsIHN1Y2Nlc3NjYiwgZXJyb3JjYikge1xuICAgICAgcmV0dXJuIHN0dWRlbnQuJHNhdmUoKS50aGVuKHN1Y2Nlc3NjYiwgZXJyb3JjYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVsZXRlU3R1ZGVudERhdGEoc3R1ZGVudCwgc3VjY2Vzc2NiLCBlcnJvcmNiKSB7XG4gICAgICBzdHVkZW50LiRyZW1vdmUoKS50aGVuKHN1Y2Nlc3NjYiwgZXJyb3JjYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkU3R1ZGVudChuZXdTdHVkZW50LCBzdWNjZXNzY2IsIGVycm9yY2IpIHtcbiAgICAgIGdldFN0dWRlbnRzRGF0YS4kYWRkKG5ld1N0dWRlbnQpLnRoZW4oc3VjY2Vzc2NiLCBlcnJvcmNiKTtcbiAgICB9XG4gIH1cblxufSkod2luZG93LmFuZ3VsYXIpO1xuIiwiKGZ1bmN0aW9uKCRhbmd1bGFyKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAkYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmRpcmVjdGl2ZSgnc3R1ZGVudFRhYmxlJywgc3R1ZGVudFRhYmxlKVxuICAgIC5kaXJlY3RpdmUoJ3N0dWRlbnREZXRhaWxzJywgc3R1ZGVudERldGFpbHMpXG4gICAgLmRpcmVjdGl2ZSgnc3R1ZGVudE1vZGFsJywgc3R1ZGVudE1vZGFsKVxuICAgIC5kaXJlY3RpdmUoJ25ld1N0dWRlbnRNb2RhbCcsIG5ld1N0dWRlbnRNb2RhbClcbiAgICAuZGlyZWN0aXZlKCdjb25maXJtYXRpb25Nb2RhbCcsIGNvbmZpcm1hdGlvbk1vZGFsKTtcblxuICBmdW5jdGlvbiBzdHVkZW50VGFibGUoKSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICBjb250cm9sbGVyOiBzdHVkZW50VGFibGVDb250cm9sbGVyLFxuICAgICAgY29udHJvbGxlckFzOiAndGFibGUnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvdHBsL3N0dWRlbnRUYWJsZS5odG1sJyxcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgb3BlbkRldGFpbHM6ICc9JyxcbiAgICAgICAgb3Blbk5ld1N0dWRlbnRNb2RhbDogJz0nXG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICBzdHVkZW50VGFibGVDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnRmlyZWJhc2VGYWN0b3J5J107XG4gICAgZnVuY3Rpb24gc3R1ZGVudFRhYmxlQ29udHJvbGxlcigkcm9vdFNjb3BlLCBGaXJlYmFzZUZhY3RvcnkpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIHZtLnN0dWRlbnRzID0gRmlyZWJhc2VGYWN0b3J5LnN0dWRlbnRzO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0dWRlbnREZXRhaWxzKCkge1xuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgY29udHJvbGxlcjogc3R1ZGVudERldGFpbHNDb250cm9sbGVyLFxuICAgICAgY29udHJvbGxlckFzOiAnc3R1ZGVudERldGFpbHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvdHBsL3N0dWRlbnREZXRhaWxzLmh0bWwnLFxuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIG9wZW5Nb2RhbDogJz0nLFxuICAgICAgICBzdHVkZW50OiAnPSdcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIC8vIHN0dWRlbnREZXRhaWxzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJ107XG4gICAgZnVuY3Rpb24gc3R1ZGVudERldGFpbHNDb250cm9sbGVyKCkge1xuICAgICAgdmFyIHZtID0gdGhpcztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdHVkZW50TW9kYWwoKSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG4gICAgICBzY29wZToge1xuICAgICAgICBvcGVuOiAnPScsXG4gICAgICAgIHRvZ2dsZU1vZGFsOiAnPSdcbiAgICAgIH0sXG4gICAgICBjb250cm9sbGVyOiBzdHVkZW50TW9kYWxDb250cm9sbGVyLFxuICAgICAgY29udHJvbGxlckFzOiAnc3R1ZGVudE1vZGFsJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL3RwbC9zdHVkZW50TW9kYWwuaHRtbCcsXG4gICAgICByZXN0cmljdDogJ0UnXG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIHN0dWRlbnRNb2RhbENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJ0ZpcmViYXNlRmFjdG9yeSddXG4gICAgZnVuY3Rpb24gc3R1ZGVudE1vZGFsQ29udHJvbGxlcigkc2NvcGUsIEZpcmViYXNlRmFjdG9yeSkge1xuICAgICAgdmFyIHZtID0gdGhpcztcblxuICAgICAgdm0uY29uZmlybWF0aW9uTW9kYWxFZGl0ID0gZmFsc2U7XG4gICAgICB2bS5jb25maXJtYXRpb25Nb2RhbERlbGV0ZSA9IGZhbHNlO1xuICAgICAgdm0uc3VibWl0RGVsZXRlID0gc3VibWl0RGVsZXRlO1xuICAgICAgdm0uc3VibWl0RWRpdCA9IHN1Ym1pdEVkaXQ7XG4gICAgICB2bS5zdHVkZW50QWN0aW9ucyA9IHtcbiAgICAgICAgc2F2ZTogRmlyZWJhc2VGYWN0b3J5LnNhdmVTdHVkZW50RGF0YSxcbiAgICAgICAgZGVsZXRlOiBGaXJlYmFzZUZhY3RvcnkuZGVsZXRlU3R1ZGVudERhdGEsXG4gICAgICAgIGFkZDogRmlyZWJhc2VGYWN0b3J5LmFkZFN0dWRlbnQsXG4gICAgICB9O1xuXG4gICAgICBmdW5jdGlvbiBzdWJtaXREZWxldGUoKSB7XG4gICAgICAgIEZpcmViYXNlRmFjdG9yeS5kZWxldGVTdHVkZW50RGF0YSh2bS5zdHVkZW50LCBkZWxldGVTdWNjZXNzQ2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spXG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHN1Ym1pdEVkaXQoKSB7XG4gICAgICAgIEZpcmViYXNlRmFjdG9yeS5zYXZlU3R1ZGVudERhdGEodm0uc3R1ZGVudCwgZWRpdFN1Y2Nlc3NDYWxsYmFjaywgZXJyb3JDYWxsYmFjaylcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZGVsZXRlU3VjY2Vzc0NhbGxiYWNrKHJlZikge1xuICAgICAgICB2bS50b2dnbGVNb2RhbChmYWxzZSk7XG4gICAgICAgIHZtLmNvbmZpcm1hdGlvbk1vZGFsRGVsZXRlID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGVkaXRTdWNjZXNzQ2FsbGJhY2socmVmKSB7XG4gICAgICAgIHZtLnRvZ2dsZU1vZGFsKGZhbHNlKTtcbiAgICAgICAgdm0uY29uZmlybWF0aW9uTW9kYWxFZGl0ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGVycm9yQ2FsbGJhY2soZXJyKSB7XG4gICAgICAgIHJldHVybiBlcnI7XG4gICAgICB9XG5cbiAgICAgICRzY29wZS4kb24oJ29wZW4tZWRpdC1zdHVkZW50LW1vZGFsJywgZnVuY3Rpb24oZXZlbnQsIHN0dWRlbnRJZCkge1xuICAgICAgICB2bS5zdHVkZW50ID0gRmlyZWJhc2VGYWN0b3J5LnN0dWRlbnQoc3R1ZGVudElkKTtcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbmV3U3R1ZGVudE1vZGFsKCkge1xuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgb3BlbjogJz0nLFxuICAgICAgICB0b2dnbGVNb2RhbDogJz0nXG4gICAgICB9LFxuICAgICAgY29udHJvbGxlcjogbmV3U3R1ZGVudE1vZGFsQ29udHJvbGxlcixcbiAgICAgIGNvbnRyb2xsZXJBczogJ25ld1N0dWRlbnRNb2RhbCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3NyYy90cGwvbmV3U3R1ZGVudE1vZGFsLmh0bWwnLFxuICAgICAgcmVzdHJpY3Q6ICdFJ1xuICAgIH1cblxuICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICBuZXdTdHVkZW50TW9kYWxDb250cm9sbGVyLiRpbmplY3QgPSBbJ0ZpcmViYXNlRmFjdG9yeSddXG4gICAgZnVuY3Rpb24gbmV3U3R1ZGVudE1vZGFsQ29udHJvbGxlcihGaXJlYmFzZUZhY3RvcnkpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgIHZtLmNvbmZpcm1hdGlvbk1vZGFsID0gZmFsc2U7XG4gICAgICB2bS5jb25maXJtYXRpb25SZXNwb25zZSA9IG51bGw7XG4gICAgICB2bS5zdHVkZW50QWN0aW9ucyA9IHtcbiAgICAgICAgc2F2ZTogRmlyZWJhc2VGYWN0b3J5LnNhdmVTdHVkZW50RGF0YSxcbiAgICAgICAgZGVsZXRlOiBGaXJlYmFzZUZhY3RvcnkuZGVsZXRlU3R1ZGVudERhdGEsXG4gICAgICAgIGFkZDogRmlyZWJhc2VGYWN0b3J5LmFkZFN0dWRlbnQsXG4gICAgICB9O1xuICAgICAgdm0uc3VibWl0ID0gc3VibWl0O1xuXG4gICAgICBmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVmKSB7XG4gICAgICAgIHZtLnRvZ2dsZU1vZGFsKGZhbHNlKTtcbiAgICAgICAgdm0uY29uZmlybWF0aW9uTW9kYWwgPSBmYWxzZTtcbiAgICAgICAgdm0ubW9kYWwgPSBmYWxzZTtcbiAgICAgICAgdm0uc3R1ZGVudCA9IHt9O1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKGVycikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHN1Ym1pdCgpIHtcbiAgICAgICAgRmlyZWJhc2VGYWN0b3J5LmFkZFN0dWRlbnQodm0uc3R1ZGVudCwgc3VjY2Vzc0NhbGxiYWNrLCBlcnJvckNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjb25maXJtYXRpb25Nb2RhbCgpIHtcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgIG9wZW46ICc9JyxcbiAgICAgICAgcHJvY2VlZDogJz0nLFxuICAgICAgICBjb25maXJtVGV4dDogJ0AnLFxuICAgICAgICBkZW55VGV4dDogJ0AnLFxuICAgICAgICB0ZXh0OiAnQCdcbiAgICAgIH0sXG4gICAgICBjb250cm9sbGVyOiBjb25maXJtYXRpb25Nb2RhbENvbnRyb2xsZXIsXG4gICAgICBjb250cm9sbGVyQXM6ICdjb25maXJtYXRpb25Nb2RhbCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJ3NyYy90cGwvY29uZmlybWF0aW9uTW9kYWwuaHRtbCcsXG4gICAgICByZXN0cmljdDogJ0UnXG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIGZ1bmN0aW9uIGNvbmZpcm1hdGlvbk1vZGFsQ29udHJvbGxlcigpIHtcbiAgICAgIHZhciB2bSA9IHRoaXM7XG4gICAgfVxuICB9XG59KSh3aW5kb3cuYW5ndWxhcik7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
