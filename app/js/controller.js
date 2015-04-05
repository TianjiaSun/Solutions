'use strict';

var store = angular.module('store',['ngRoute'])
  .controller('StoreListCtrl', function($scope, $http, $route, $routeParams, $sce, $timeout) {

  $scope.header = "Top Solutions";

  // get app info from ASA
  var req_app = {
    method: 'POST',
    url: 'http://asa.gausian.com',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: $.param({user_app_id:'app_id', service_app_name:'UserAppInfo', request_string: "get"})
  };
  
  $http(req_app).success(function(data) {
    $scope.apps = angular.fromJson(data.response);
    console.log($scope.apps);
    
    // get solutions info from ASA
    // only do this after get apps info from ASA
    var req_sol = {
      method: 'POST',
      url: 'http://asa.gausian.com',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: $.param({user_app_id:'app_id', service_app_name:'Solution', request_string: "get"})
    };
    $http(req_sol).success(function(data) {
      $scope.solutions = angular.fromJson(data.response);
      console.log("original solutions from ASA");
      console.log($scope.solutions);
      // console.log($scope.solutions);

      // append solution with their apps
      // loop every solution
      for(var i=0; i<$scope.solutions.length; i++){
        $scope.solutions[i].app_array = [];
        var solution = $scope.solutions[i];
        var solution_apps_string_array = solution.apps.split(',');
        // loop every app in the solution
        for(var k=0; k<solution_apps_string_array.length; k++){
          // find the app from ASA returned info
          for(var h=0; h<$scope.apps.length; h++){
            if($scope.apps[h].id === solution_apps_string_array[k]){
              //console.log("matched");
              //console.log($scope.apps[h].id);
              $scope.solutions[i].app_array.push($scope.apps[h]);
            }
          }
        }
      }
      console.log("solutions is connected with apps");
      console.log($scope.solutions);

      // open Top Solution page
      // only do this after get solutions info from ASA
      $scope.filterredSolutions = [];
      var j=0;
      for(var i=0; i<$scope.solutions.length; i++){
        var solution = $scope.solutions[i];
        // scope.header === Top Solutions at this moment
        if(solution.catalog.match($scope.header)){
          $scope.filterredSolutions[j++] = solution;
        }
      }
    });
  });

  // to avoid flashing during page loading
  $scope.init = function () {
    $("#byBusiness_container").fadeIn(1000);
  };

  // open share solution dialog
  $scope.new_solution = function() {
    $("#Share_container").fadeIn(300);
  }

  // close share info dialog
  $scope.close_new_solution = function() {
    $("#Share_container").hide();
  }

  // show by Business Page
  $scope.allSolutions = function() {
    $("#search_container").hide();
    $("#list_container").hide();
    $("#byBusiness_container").fadeIn(500);
  }

  // install a solution
  $scope.install = function(solution) {
    alert("install app id: " + solution.apps);
  }

  // open detail page for one app
  $scope.openApp = function(app) {
    // firstly move overlay container into window
    $scope.app_path = $sce.trustAsResourceUrl(app.path);
    $scope.app = app;
    $("#list_container").fadeOut(500);
    $("#search_container").fadeOut(500);
    $("#movein_container").show();
    // secondly show iframe container
    $timeout(function(){ $("#overlay_container").fadeIn(500); }, 550);
  }

  $scope.closeApp = function() {
    $scope.app = null;
    $scope.search_header = null;
    $scope.app_path = $sce.trustAsResourceUrl(null);
    $("#overlay_container").hide();
    $("#movein_container").hide();
    $("#list_container").fadeIn(500);
    $('#iframe_cover_before_loaded').show();
  }

  $scope.filterCAT = function(catalog) {
    $scope.header = catalog;
    $("#byBusiness_container").hide();
    $("#search_container").hide();
    $("#list_container").hide();
    // filter with catalog info
    $scope.filterredSolutions = [];
    var j=0;
    for(var i=0; i<$scope.solutions.length; i++){
      var solution = $scope.solutions[i];
      if(solution.catalog.match($scope.header)){
        $scope.filterredSolutions[j++] = solution;
      }
    }
    $("#list_container").fadeIn(500);
    //$timeout(function(){ $(".app_unit").fadeIn(100); }, 800); 
  }

  $scope.Search = function(keyEvent) {
    // if enter is input in search box
    if (keyEvent.which === 13){
      // hide list page
      $("#byBusiness_container").hide();
      $("#list_container").hide();
      $("#search_container").hide();
      $scope.searchedSolution = [];
      var j=0;
      for(var i=0; i<$scope.solutions.length; i++){
        var solution = $scope.solutions[i];
        if(solution.keyword.match(angular.lowercase($scope.query))){
          $scope.searchedSolution[j++] = solution;
        }
      }
      $("#search_container").fadeIn(500);
      if($scope.searchedSolution.length === 0) {
        $scope.search_header = "Sorry, no matching solution.";
      }
      else if($scope.searchedSolution.length === 1) {
        $scope.search_header = "There is one result:";
      }
      else {
        $scope.search_header = "There are " + $scope.searchedSolution.length + " results:";
      }
    }
    // if escape is input in search box
    if (keyEvent.which === 27){
      // close search result
      $("#search_container").hide();
      $("#list_container").hide();
      $("#byBusiness_container").fadeIn(500);
      $scope.search_header = null;
      $scope.query = null;
    }
  }

  $scope.ClickSearch = function() {
    // hide list page
    $("#byBusiness_container").hide();
    $("#list_container").hide();
    $("#search_container").hide();
    $scope.searchedSolution = [];
    var j=0;
    for(var i=0; i<$scope.solutions.length; i++){
      var solution = $scope.solutions[i];
      if(solution.keyword.match(angular.lowercase($scope.query))){
        $scope.searchedSolution[j++] = solution;
      }
    }
    $("#search_container").fadeIn(500);
    if($scope.searchedSolution.length === 0) {
      $scope.search_header = "Sorry, no matching solution.";
    }
    else if($scope.searchedSolution.length === 1) {
      $scope.search_header = "There is one result:";
    }
    else {
      $scope.search_header = "There are " + $scope.searchedSolution.length + " results:";
    }
  }

})