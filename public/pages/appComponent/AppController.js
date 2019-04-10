app.controller('AppController', function($scope, $http, SERVICE_URL, DTOptionsBuilder, DTColumnDefBuilder, $location) {
    //$scope.apps=[];
    //$scope.dizi=[];


    if ($location.path() == '/app') {
        $scope.dtOptions = { responsive: true, scrollX: "auto" };

        $http.get(SERVICE_URL + '/apps')
        .then(
            function(response) {
                if (response.data.error)
                    console.log(response.data.error);
                    $scope.apps = response.data.data;
                    console.log("apps", $scope.apps);

            },
            function(response) {
                //$scope.dizi.push(a);
                console.log(response);
            }
            );
    }

});