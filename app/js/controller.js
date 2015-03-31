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
  });


  // get solutions info from ASA
  $scope.data;
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
    console.log("solutions");
    console.log($scope.solutions);

    // open Top Solution page
    $scope.filterredSolutions = [];
    var j=0;
    for(var i=0; i<$scope.solutions.length; i++){
      var solution = $scope.solutions[i];
      // scope.header = Top Solutions at this moment
      if(solution.catalog.match($scope.header)){
        $scope.filterredSolutions[j++] = solution;
      }
    }
    //console.log("filterredSolutions");
    //console.log($scope.filterredSolutions);
  });


  // to avoid flashing during page loading
  $scope.init = function () {
    $("#list_container").fadeIn(1000);
  };

  // open share solution dialog
  $scope.Share_info = function() {
    $("#Share_container").fadeIn(300);
  }

  // close share info dialog
  $scope.Close_share = function() {
    $("#Share_container").hide();
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
      $("#list_container").hide();
      $("#search_container").hide();
      $scope.searchedApps = [];
      var j=0;
      for(var i=0; i<$scope.apps.length; i++){
        var app = $scope.apps[i];
        if(app.keyword.match(angular.lowercase($scope.query))){
          $scope.searchedApps[j++] = app;
        }
      }
      $("#search_container").fadeIn(500);
      if($scope.searchedApps.length === 0) {
        $scope.search_header = "Sorry, no matching APP.";
      }
      else if($scope.searchedApps.length === 1) {
        $scope.search_header = "There is one result:";
      }
      else {
        $scope.search_header = "There are " + $scope.searchedApps.length + " results:";
      }
    }
    // if escape is input in search box
    if (keyEvent.which === 27){
      // close search result
      $("#search_container").hide();
      $("#list_container").fadeIn(500);
      $scope.search_header = null;
      $scope.query = null;
    }
  }

  $scope.ClickSearch = function() {
    // hide list page
    $("#list_container").hide();
    $("#search_container").hide();
    $scope.searchedApps = [];
    var j=0;
    for(var i=0; i<$scope.apps.length; i++){
      var app = $scope.apps[i];
      if(app.keyword.match($scope.query)){
        $scope.searchedApps[j++] = app;
      }
    }
    if($scope.searchedApps.length === 0) {
      $scope.search_header = "Sorry, no matching APP.";
    }
    else if($scope.searchedApps.length === 1) {
      $scope.search_header = "There is one result:";
    }
    else {
      $scope.search_header = "There are " + $scope.searchedApps.length + " results:";
    }
    $("#search_container").fadeIn(500);
  }

})