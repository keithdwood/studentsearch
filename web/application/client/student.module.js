angular.module('StudentApp', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            templateUrl: 'studentsearch.html',
            controller: 'StudentController'
        })
            .when('/studentdetail/:studentId',{
                templateUrl: 'studentdetail.html',
                controller: 'StudentDetailController'
            });
    }])
    .controller("StudentController", ['$scope', '$log', 'StudentService', function ($scope, $log, studentService) {
        $scope.results;
        $scope.firstName = '';
        $scope.lastName = '';

        $scope.doSearch = function (firstName, lastName) {
            $log.info("Searching for " + firstName);
            $log.info("Last name value is " + lastName);
            studentService.search(firstName, lastName)
                .success(function(data, status, headers){
                    $log.info("Successful search");
                    $log.info(data);
                    $scope.results = data;
            });
            $log.info("Controller set results to: " + $scope.results);
        }

    }])
    .controller('StudentDetailController', ['$scope', '$log', '$routeParams', 'StudentService', function($scope, $log, $routeParams, studentService){
        $log.info("Handle request for student: " + $routeParams.studentId);
        var studentDetails = studentService.getStudentDetail($routeParams.studentId)
            .success(function(data, status, headers){
                $log.info("Success retrieving data.")
                $scope.student = data;
            });
    }])
    .factory('StudentService', function ($http, $log) {

        var urlBuilder = function(){
            var serviceBaseUrl = "http://localhost:3000/api/student";

            var getSearchUrl = function(firstName, lastName){
                var searchUrl = serviceBaseUrl;
                if (firstName || lastName){
                    searchUrl = searchUrl + '?';
                    searchUrl = searchUrl + (firstName ? 'first=' + firstName : '');
                    if (firstName && lastName){
                        searchUrl = searchUrl + '&';
                    }
                    searchUrl = searchUrl + (lastName ? 'last=' + lastName : '');
                }
                return searchUrl;
            }

            var getStudentDetailUrl = function(studentId){
                return serviceBaseUrl + '/' + studentId;
            }

            return {
                getSearchUrl: getSearchUrl,
                getStudentDetailUrl: getStudentDetailUrl
            }
        }();

        var studentSearch = function(firstName, lastName){
            $log.info("Service is searching first: " + firstName);
            return $http({
                    method: 'GET',
                    url: urlBuilder.getSearchUrl(firstName, lastName)
                }
            );
        };

        var getStudentDetails = function(studentId){
            $log.info("Get details for id: " + studentId);
            return $http({
                method: 'GET',
                url: urlBuilder.getStudentDetailUrl(studentId)
            })
        };

        return {
            search: function(firstName, lastName){
                return studentSearch(firstName, lastName);
            },
            getStudentDetail: function(studentId){
                return getStudentDetails(studentId);
            }
        };
    });