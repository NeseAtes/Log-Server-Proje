var app=angular.module('myApp',['ngRoute',
  'datatables', 'ngFileUpload']);

angular.forEach(config,function(key,value){
  app.constant(value,key);
});
app.config(function($routeProvider,$locationProvider){
  $locationProvider.hashPrefix('');
  $routeProvider.when('/log', {
    templateUrl: './pages/logComponent/log.html',
    controller: 'LogController'
  }).when('/app', {
    templateUrl: './pages/appComponent/app.html',
    controller: 'AppController'
  });
});