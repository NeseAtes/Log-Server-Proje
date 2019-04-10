app.factory('websocketService', function () {
        return {
            start: function (url, callback) {
                var websocket = new WebSocket(url);
                websocket.onopen = function () {
                };
                websocket.onclose = function () {
                };
                websocket.onmessage = function (evt) {
                    callback(evt);
                };
            }
        }
    }
).controller('webSocketController', function ($scope,$http, websocketService) {
    $scope.items=[];
    $http.get("http://localhost:3000/api/log/list").then(successCallback, errorCallback);
      function successCallback(response){
        for (var i = 0; i < response.data.data.length; i++) {
          console.log(response);
          var a = response.data.data[i]
          if (a.log_level == 1) {
            a.class = 'red';
          }
          else if (a.log_level == 2) {
            a.class = 'green';
          }
          else{
            a.class = 'yellow';
          }
        }
        $scope.items=response.data.data.reverse();
      }
      function errorCallback(error){
         console.log(error);
      }
    websocketService.start("ws://localhost:3000", function (evt) {
      $scope.tmp = angular.fromJson(evt.data);
        $scope.$apply(function () {
          var opt={
            app_name:$scope.tmp.app_name,
            date:$scope.tmp.date,
            description:$scope.tmp.description,
            log_level:$scope.tmp.log_level
          };
          if ($scope.tmp.log_level == 1) {
            opt.class = 'red'
          }
          else if ($scope.tmp.log_level == 2) {
            opt.class = 'green'
          }
          else{
            opt.class = 'yellow'
          }
          $scope.items.push(opt);
        });
    });
}).filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});