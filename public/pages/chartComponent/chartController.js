app.controller('chartController', function($scope,$http) {
  $scope.labels=[];
  $scope.series=[];
  $scope.options={
    legend:{display: true}
  };

  $scope.datam=[];
  $http.get('http://localhost:3000/api/chart').then(function(resp){
    var data;
    var maxsLogLevel=0;

    for (var i = 0; i < resp.data.data.length; i++) {
      console.log("resp",resp.data.data)
      data=resp.data.data[i];
      $scope.labels.push(data.app_name);
      $scope.series.push(data.log_level);

      $scope.labels=$scope.labels.filter(distinct);//app_namelerin her birinden bir tane olmasını sağlıyor.
      $scope.series=$scope.series.filter(distinct);//log_levelların "  "

      if(data.log_level>maxsLogLevel){
        if(data.log_level-maxsLogLevel!=0){
          for (var i = 0; i < (data.log_level-maxsLogLevel); i++) {
            $scope.datam.push([]);
          }         
        maxsLogLevel=data.log_level;
        }
      }
      var index = $scope.labels.findIndex(item => item === data.app_name);
      var loglevel_index=$scope.series.findIndex(item => item === data.log_level);
      var length=$scope.datam[loglevel_index].length;
      if(length<=index){
        for (var i = length; i < index; i++) {
          $scope.datam[loglevel_index].push(0);
        }
        $scope.datam[loglevel_index][index]=data.count;
      }else{
        $scope.datam[loglevel_index][index]=data.count;
      }
    }
  });
  
  const distinct=(value,index,self)=>{
    return self.indexOf(value)===index;
  }
});
