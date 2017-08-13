// first we have to declare the module. note that [] is where we will declare the dependecies later. Right now we are leaving it blank
var myApp = angular.module('soccerApp', ['ngRoute']);

// this is without $scope

/*Factory to transfer data between All Matches View and Single Match View*/

myApp.factory('matchDetails', function() {
	
	var singleMatchDetails = null;
	
	return {
	
		getDetails:function() {
	
			return singleMatchDetails;
	
		},
	
		setDetails:function(value) {
	
			singleMatchDetails = value;
		
		}
	
	}

});

/*Controller for NavBar*/

myApp.controller("navbarController",['$timeout',function ($timeout) {

	//this.show = navBarService.show;
    var main = this;
	
	this.collapseNavBar = function() {
		
		var el = document.getElementById("menu-button");

		el.classList.add('collapsed');
		
		var el1 = document.getElementById("bs-example-navbar-collapse-1");

		el1.classList.remove('in');
			
	};

}]);



/*Controller for the Footer*/

myApp.controller("footerController",['$timeout',function ($timeout) {

	var main = this;

	this.footerLoaded = false;
    //this.show = navBarService.show;
    
    $timeout(function () {
    
        main.footerLoaded = true
    
    }, 2000);

}]);


myApp.run(function($rootScope, $location) {

    $rootScope.location = $location;

});

/*Controller for the All Matches View*/

myApp.controller('resultsController',['$http','$timeout','matchDetails','$routeParams', function($http, $timeout, matchDetails,$routeParams) { 

//create a context
	var main = this;

	this.rounds1 = [];
	
	this.baseUrl = 'https://raw.githubusercontent.com/openfootball/football.json/master/';
	
	this.years = ["2016/17", "2015/16"];
	
	this.matchDays = ["All Matchdays"];
	
	this.matchDay;
	
	this.dates1 = [];

	this.year;

	this.currentSeason = "2016/17";

	this.currentMatchDay = [];

	this.teamsNames = ["All Clubs"];

	this.clubs = this.teamsNames[0];
	
	this.season = this.years[0];

	this.statusOfMatch = ["All Matches"];

	this.matchStatus = this.statusOfMatch[0];

	this.homeAway = this.statusOfMatch[0];
	
	this.playingMatchDate;
	
	this.allDetails = {};
	
	this.playingTeam1Code;
	
	this.playingTeam2Code;

	this.currentFoundClub;

	this.currentClubMatchStatus;

	this.currentClubLocation;


/*Function to pass data from All Matches Controller to Single Match Controller*/

	this.passInfo = function(round,date,team1,score1,score2,team2,code1,code2) {

		main.allDetails.round = round;
		
		main.allDetails.date = date;
		
		main.allDetails.team1 = team1;
		
		main.allDetails.score1 = score1;
		
		main.allDetails.score2 = score2;
		
		main.allDetails.team2 = team2;
		
		main.allDetails.code1 = code1;
		
		main.allDetails.code2 = code2;

		main.playingMatchDate = $routeParams.date;
		
		main.playingTeam1Code = $routeParams.code1;
		
		main.playingTeam2Code = $routeParams.code2;
		
		matchDetails.setDetails(main.allDetails);
		
	};

	
/*Function to change the All Matches View when season selected is changed*/

	this.checkSeason = function(modelData){

		if (document.getElementById("seasonSelected") != null) {

			main.currentSeason = document.getElementById("seasonSelected").value;
		
		}

		main.dates1 = [];

		main.matchDays = ["All Matchdays"];

		main.teamsNames = ["All Clubs"];

		main.clubs = main.teamsNames[0];

		$http({
			
			method: 'GET',
			
			url: main.baseUrl + main.currentSeason.split('/').join('-') + '/en.1.json'
		  
		  }).then(function successCallback(response) {
			  // this callback will be called asynchronously
			  // when the response is available
			
				  main.rounds1 = response.data.rounds;

				  main.year = response.data.name.split(" ")[3];	  
				 
				  angular.forEach(response.data.rounds, function(value, key) {

					  main.matchDays.push(response.data.rounds[key].name);
					  
						angular.forEach(response.data.rounds[key].matches, function(value1, key1) {

							main.dates1.push(response.data.rounds[key].matches[key1].date);

							if(main.teamsNames.indexOf(response.data.rounds[key].matches[key1].team1.name) === -1){
     					   
     					   		main.teamsNames.push(response.data.rounds[key].matches[key1].team1.name);

  						  	}
						
						});

				  });

				  console.log(main.teamsNames);
						
				  main.matchDay = main.matchDays[0];

			}, 
				
			function errorCallback(response) {
			  // called asynchronously if an error occurs
			  // or server returns response with an error status.
			  
			  alert("Some error occurred. Check the console.");
			  

			});

		};

/*Function to load data in All Matches View for the first time*/
		
	this.loadData = function() {
			
		$http({
			
			method: 'GET',
			
			url: main.baseUrl + main.currentSeason.split('/').join('-') + '/en.1.json'
		  
		  }).then(function successCallback(response) {
			  // this callback will be called asynchronously
			  // when the response is available


				  main.rounds1 = response.data.rounds;
				  
				  main.year = response.data.name.split(" ")[3]; 
				  
				  angular.forEach(response.data.rounds, function(value, key) {

					  main.matchDays.push(response.data.rounds[key].name);

					  angular.forEach(response.data.rounds[key].matches, function(value1, key1) {

						main.dates1.push(response.data.rounds[key].matches[key1].date);

						if(main.teamsNames.indexOf(response.data.rounds[key].matches[key1].team1.name) === -1){
     					   
     					   main.teamsNames.push(response.data.rounds[key].matches[key1].team1.name);

  						}
				
					 });

				 });
						
				 main.matchDay = main.matchDays[0];
				
			}, 
				
			function errorCallback(response) {
			  // called asynchronously if an error occurs
			  // or server returns response with an error status.
			  
			  alert("Some error occurred. Check the console.");
			  

			});

	};

/*Function to reset all filters in All Matches View*/

	this.resetAllFilters = function() {

		  	main.season = "2016/17";
		  	
		  	main.matchDay = "All Matchdays";
		  	
		  	main.clubs = "All Clubs";
		  	
		  	main.dates = undefined;
		  	
		  	main.matchStatus = "All Matches";
		  	
		  	main.homeAway = "All Matches";
 
		  	$timeout(function () {
		  	
		  		main.checkSeason(main.season);

			}, 1000);
		  
	 };

}]); // end controller



/*Controller for the Single Match View*/

myApp.controller('matchController',['$http','matchDetails', function($http, matchDetails) { 

	var main = this;

	this.matchWinner;

	this.currentMatchDetails = {};
	
	this.loadSingleMatch = function() {
		
		main.currentMatchDetails = matchDetails.getDetails();

		main.matchWinner = (main.currentMatchDetails.score1 > main.currentMatchDetails.score2) ? (main.currentMatchDetails.team1 + " won the match") :
		((main.currentMatchDetails.score1 < main.currentMatchDetails.score2) ? (main.currentMatchDetails.team2 + " won the match") : "The match is drawn");

	};
			
}]); //end controller



/*Controller for the All Teams View*/

myApp.controller('clubsController',['$http',function($http) { 

	var main = this;

	this.years1 = ["2016/17", "2015/16"];

	this.season = this.years1[0];
	
	this.currentSeason = '2016/17';

	this.rounds;

	this.goalsOfTeams = 0;

	this.goalsAgainstTeams = 0;

    this.currentTeamWin = 0;
 	
 	this.currentTeamLose = 0;

	this.currentTeamDraw = 0;

	this.currentTeamMatches = 0;

	this.currentTeamsPoints = 0;

	this.combinedTeams = [];

	this.teamForm = [];

	this.teamCode = [];

	this.teamsNames = [];
		  
	this.baseUrl = 'https://raw.githubusercontent.com/openfootball/football.json/master/';

	//this.currentSeason = "2016/17";

/*Function to check if the season is changed in the All Teams view and then change the view accordingly*/

	main.checkSeason = function(modelData){

		main.teamsNames = [];

		if (document.getElementById("selected") != null) {

			main.currentSeason = document.getElementById("selected").value;

		
		}

		$http({
			
			method: 'GET',
			
			url: main.baseUrl + main.currentSeason.split('/').join('-') + '/en.1.json'
		  
		  }).then(function successCallback(response) {
			  // this callback will be called asynchronously
			  // when the response is available
			  main.rounds = response.data.rounds;

			  angular.forEach(response.data.rounds, function(value, key) {
					  
					angular.forEach(response.data.rounds[key].matches, function(value1, key1) {

						if(main.teamsNames.indexOf(response.data.rounds[key].matches[key1].team1.name) === -1){
     					   
     					   	main.teamsNames.push(response.data.rounds[key].matches[key1].team1.name);

  						}
						
					});

			  });

			  angular.forEach(main.teamsNames, function(value4, key4) {

            	angular.forEach(main.rounds, function(value5, key5) {

              		angular.forEach(main.rounds[key5].matches, function(value6, key6) {

              			if(main.teamsNames[key4] == main.rounds[key5].matches[key6].team1.name && main.rounds[key5].matches[key6].score1 != null) {
                  
                  			main.goalsOfTeams = main.goalsOfTeams + main.rounds[key5].matches[key6].score1;
                  
                  			main.goalsAgainstTeams = main.goalsAgainstTeams + main.rounds[key5].matches[key6].score2;
			     		
			     			main.currentTeamMatches++;
					  
					  		if(main.rounds[key5].matches[key6].score1 > main.rounds[key5].matches[key6].score2) {
						  	
						  		main.currentTeamWin++;
								
								main.currentTeamsPoints = main.currentTeamsPoints + 3;
						  
						  	   (main.currentTeamMatches >= 34)?main.teamForm.push("W"):"";
						  

					 		 }
					  
					  		else if (main.rounds[key5].matches[key6].score1 < main.rounds[key5].matches[key6].score2){
						  		
						  		main.currentTeamLose++;
						  
						  	   (main.currentTeamMatches >= 34)?main.teamForm.push("L"):"";
					  		}
					  
					  		else {
						  
						  		main.currentTeamDraw++;
						  
						  		main.currentTeamsPoints = main.currentTeamsPoints + 1;
						  
						  	   (main.currentTeamMatches >= 34)?main.teamForm.push("D"):"";
					  		}

					 		 main.teamCode = main.rounds[key5].matches[key6].team1.code;
	                  
              			}

    					else if (main.teamsNames[key4] == main.rounds[key5].matches[key6].team2.name && main.rounds[key5].matches[key6].score2!= null) {
               
               				 main.goalsOfTeams = main.goalsOfTeams + main.rounds[key5].matches[key6].score2;
               				
               				 main.goalsAgainstTeams = main.goalsAgainstTeams + main.rounds[key5].matches[key6].score1;
                		
                			 main.currentTeamMatches++;
					
					  		if(main.rounds[key5].matches[key6].score2 > main.rounds[key5].matches[key6].score1) {
						 
						 		 main.currentTeamWin++;
						 
						 		 main.currentTeamsPoints = main.currentTeamsPoints + 3;
						  
						  		(main.currentTeamMatches >= 34)?main.teamForm.push("W"):"";
					  		}
					  
					  		else if (main.rounds[key5].matches[key6].score2 < main.rounds[key5].matches[key6].score1){
						  		
						  		main.currentTeamLose++;
						  
						  		(main.currentTeamMatches >= 34)?main.teamForm.push("L"):"";
					  		}
					  
					  		else {
						 	
						 		main.currentTeamDraw++;
						  	
						  		main.currentTeamsPoints = main.currentTeamsPoints + 1;
						  
						  	   (main.currentTeamMatches >= 34)?main.teamForm.push("D"):"";
					  		}
              
              			}

					});

       			});

            
			main.combinedTeams[key4] = Array(main.teamsNames[key4],main.teamCode, main.currentTeamMatches, main.currentTeamWin, main.currentTeamDraw, main.currentTeamLose, main.goalsOfTeams, main.goalsAgainstTeams, (main.goalsOfTeams-main.goalsAgainstTeams), main.currentTeamsPoints, main.teamForm );
            
            main.goalsOfTeams = 0;
            
            main.goalsAgainstTeams = 0;
            
            main.teamForm = [];
			
			main.currentTeamWin = 0;
			
			main.currentTeamLose = 0;
			
			main.currentTeamDraw = 0;
			
			main.currentTeamMatches = 0;
			
			main.currentTeamsPoints = 0;


		});

		}, 
				
			function errorCallback(response) {
			  // called asynchronously if an error occurs
			  // or server returns response with an error status.
			  
			  alert("Some error occurred. Check the console.");
			  

			});

	};

/*HTTP Request the data for the first time in All Teams View*/
	this.loadClubsResults = function() {	

		$http({
			
			method: 'GET',
			
			url: main.baseUrl + main.currentSeason.split('/').join('-') + '/en.1.json'
		  
		  }).then(function successCallback(response) {
			  // this callback will be called asynchronously
			  // when the response is available
			  main.rounds = response.data.rounds;

			  angular.forEach(response.data.rounds, function(value, key) {
					  
					angular.forEach(response.data.rounds[key].matches, function(value1, key1) {

						if(main.teamsNames.indexOf(response.data.rounds[key].matches[key1].team1.name) === -1){
     					   
     					   	main.teamsNames.push(response.data.rounds[key].matches[key1].team1.name);

  						}
						
					});

			  });

			  angular.forEach(main.teamsNames, function(value4, key4) {

            	angular.forEach(main.rounds, function(value5, key5) {

              		angular.forEach(main.rounds[key5].matches, function(value6, key6) {

              			if(main.teamsNames[key4] == main.rounds[key5].matches[key6].team1.name && main.rounds[key5].matches[key6].score1 != null) {
                  
                  			main.goalsOfTeams = main.goalsOfTeams + main.rounds[key5].matches[key6].score1;
                  
                  			main.goalsAgainstTeams = main.goalsAgainstTeams + main.rounds[key5].matches[key6].score2;
			     		
			     			main.currentTeamMatches++;
					  
					  		if(main.rounds[key5].matches[key6].score1 > main.rounds[key5].matches[key6].score2) {
						  	
						  		main.currentTeamWin++;
								
								main.currentTeamsPoints = main.currentTeamsPoints + 3;
						  
						  	   (main.currentTeamMatches >= 34)?main.teamForm.push("W"):"";
						  

					 		 }
					  
					  		else if (main.rounds[key5].matches[key6].score1 < main.rounds[key5].matches[key6].score2){
						  		
						  		main.currentTeamLose++;
						  
						  	   (main.currentTeamMatches >= 34)?main.teamForm.push("L"):"";
					  		}
					  
					  		else {
						  
						  		main.currentTeamDraw++;
						  
						  		main.currentTeamsPoints = main.currentTeamsPoints + 1;
						  
						  	   (main.currentTeamMatches >= 34)?main.teamForm.push("D"):"";
					  		}

					 		 main.teamCode = main.rounds[key5].matches[key6].team1.code;
	                  
              			}

    					else if (main.teamsNames[key4] == main.rounds[key5].matches[key6].team2.name && main.rounds[key5].matches[key6].score2!= null) {
               
               				 main.goalsOfTeams = main.goalsOfTeams + main.rounds[key5].matches[key6].score2;
               				
               				 main.goalsAgainstTeams = main.goalsAgainstTeams + main.rounds[key5].matches[key6].score1;
                		
                			 main.currentTeamMatches++;
					
					  		if(main.rounds[key5].matches[key6].score2 > main.rounds[key5].matches[key6].score1) {
						 
						 		 main.currentTeamWin++;
						 
						 		 main.currentTeamsPoints = main.currentTeamsPoints + 3;
						  
						  		(main.currentTeamMatches >= 34)?main.teamForm.push("W"):"";
					  		}
					  
					  		else if (main.rounds[key5].matches[key6].score2 < main.rounds[key5].matches[key6].score1){
						  		
						  		main.currentTeamLose++;
						  
						  		(main.currentTeamMatches >= 34)?main.teamForm.push("L"):"";
					  		}
					  
					  		else {
						 	
						 		main.currentTeamDraw++;
						  	
						  		main.currentTeamsPoints = main.currentTeamsPoints + 1;
						  
						  	   (main.currentTeamMatches >= 34)?main.teamForm.push("D"):"";
					  		}
              
              			}

					});

       			});

            
			main.combinedTeams[key4] = Array(main.teamsNames[key4],main.teamCode, main.currentTeamMatches, main.currentTeamWin, main.currentTeamDraw, main.currentTeamLose, main.goalsOfTeams, main.goalsAgainstTeams, (main.goalsOfTeams-main.goalsAgainstTeams), main.currentTeamsPoints, main.teamForm );
            
            main.goalsOfTeams = 0;
            
            main.goalsAgainstTeams = 0;
            
            main.teamForm = [];
			
			main.currentTeamWin = 0;
			
			main.currentTeamLose = 0;
			
			main.currentTeamDraw = 0;
			
			main.currentTeamMatches = 0;
			
			main.currentTeamsPoints = 0;


		});

		}, 
				
			function errorCallback(response) {
			  // called asynchronously if an error occurs
			  // or server returns response with an error status.
			  
			  alert("Some error occurred. Check the console.");
			  

			});
	};

}]); //end controller