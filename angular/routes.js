//var myApp = angular.module('blogApp', ['ngRoute']); 

myApp.config(['$routeProvider', function($routeProvider){
    
    $routeProvider
        .when('/',{
            templateUrl     : 'views/frontpage-view.html'  
        })
        .when('/matches',{
            // location of the template
            templateUrl     : 'views/allmatches-view.html',
            // Which controller it should use 
            controller      : 'resultsController',
            // what is the alias of that controller.
            controllerAs    : 'matchResult'
        })
		.when('/matches/:playingTeam1Code:playingTeam2Code:playingMatchDate',{

            templateUrl     : 'views/match-view.html',
            controller      : 'matchController',
            controllerAs    : 'currentMatch1'
        })
        .when('/allclubs',{
            templateUrl     : 'views/teams-view.html',
            controller      : 'clubsController',
            controllerAs    : 'currentclub'
        })
        .otherwise(
            {
                //redirectTo:'/'
                template   : '<h1>404 page not found</h1>'
            }
        );
}]);