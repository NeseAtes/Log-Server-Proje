var app = angular.module('myApp',['ngRoute', 'ngStorage', 'ngCookies',
  'datatables', 'ngFileUpload' ,'ui.bootstrap', 'chart.js' ,'dibari.angular-ellipsis' ]);
angular.forEach(config,function(key,value) {
  app.constant(value,key);
});
app.config(function($routeProvider,$locationProvider){
  $locationProvider.hashPrefix('');
  $routeProvider.when('/log', {
    templateUrl: './pages/logComponent/log.html',
    controller: 'LogController'
  }).when('/',{
    templateUrl:'./pages/chartComponent/chart.html',
    controller:'chartController'
  }).when('/app', {
    templateUrl: './pages/appComponent/app.html',
    controller: 'AppController'
  }).when('/socket', {
  	templateUrl: './pages/socketComponent/webSocket.html',
  	controller: 'webSocketController'
  }).when('/login',{
    templateUrl:'./pages/loginComponent/login.html',
    controller:'loginController'
  }).when('/requests',{
    templateUrl:'./pages/adminComponent/admin.html',
    controller:'adminController'
  });
});

app.controller('storageController',function($scope,$localStorage){
  $scope.isAdmin=function(){
    $scope.is_admin=$localStorage.is_admin;
    return $scope.is_admin;
  }
});
