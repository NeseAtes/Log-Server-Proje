app.controller('LogController', function($scope, $http, $filter, $interval, SERVICE_URL, DTOptionsBuilder, DTColumnDefBuilder, $location) {
    $scope.logs = [];
    $scope.users =[];

    $scope.viewby = 10;
    $scope.currentPage = 1;

    $scope.itemsPerPage = $scope.viewby;
    //$scope.maxSize = 5;


    $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.getAllLogs=function(){ 
        if ($location.path() == '/log') {

            $http.get(SERVICE_URL + '/log')
            .then(
                function(response) 
                {
                    if (response.data.error)
                        console.log(response.data.error);
                        $scope.logs = response.data.data;
                        $scope.users = response.data.data;
        $scope.totalItems = $scope.users.length;
        console.log($scope.users.length);
                },
                function(response) {
                    console.log(response);
                }
            );
        }
    }

    $scope.getAllLogs()
    

    $scope.yolla = function(){
        var data = {
            value : $scope.elastic
        };
        console.log($scope.elastic);
        $http.post("http://localhost:3000/api/es/search", JSON.stringify(data))
        .then(function(resp){
            console.log("ES sonuc: ", resp.data.hits);
        //$scope.logs=[];
        $scope.users=[];
            console.log($scope.logs); 
            if ($scope.elastic == "") {
                $scope.getAllLogs()
            }
            else{
            $scope.logs=[];
            $scope.users=[];
                for (var i = 0; i < resp.data.hits.length; i++) {
               var a = resp.data.hits[i]._source;
               console.log(resp.data.hits[i]._source);
               //$scope.logs.push(a);
               $scope.users.push(a);
            }
            } 
            $scope.totalItems = $scope.users.length;
            $scope.currentPage = 1;
        },function(err){
            console.log("ES err: ", err);
        });
    }


    $scope.getFilteredData = function(res,error)
    {
        var veri= "";
        if ($scope.filters.app_name == undefined && $scope.filters.date === undefined && $scope.filters.log_level === undefined ) 
        {
            $window.alert('boş')
        }
        if ($scope.filters.app_name !== undefined) {
            if (veri === "") {
                veri+="?";
            }
            else{
                veri+="&";
            }
            veri+='app_name='+$scope.filters.app_name;
        }
        if ($scope.filters.date !== undefined) {
            if (veri === "") {
                veri+="?";
            }
            else{
                veri+="&";
            }
            veri+='date='+$scope.filters.date;
        }
        if ($scope.filters.log_level !== undefined) {
            if (veri === "") {
                veri+="?";
            }
            else{
                veri+="&";
            }
            veri+='log_level='+$scope.filters.log_level;
        }        

        $http.get('http://localhost:3000/api/log' +veri)
        .then(function(resp) {
            $scope.users = [];
                if (resp.data.error){
                    console.log("hata",resp.data.error);
                }
                else{
                $scope.users = [];
                console.log("aa", resp);
                $scope.users = resp.data.data;
                console.log("bb", resp.data.data);
                } 
            $scope.totalItems = $scope.users.length;
            $scope.currentPage = 1;
            //$scope.filters.app_name = $scope.users[0];
            //$scope.filters.log_level = $scope.users[0];
        });
    }
});

app.filter('unique', function () {

    return function (items, filterOn) {

            
        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});
