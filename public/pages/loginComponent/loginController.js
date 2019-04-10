app.controller('loginController', function($scope, $http,$cookies,$window,$location,$localStorage,SERVICE_URL) {
	$scope.is_register=false;
	$scope.dene=function(){
		if ($scope.is_register==false) {
			$scope.is_register=true;
		}
		else
			$scope.is_register=false
	};

	$scope.showBtn=function(){
		console.log("cookie:" , $cookies.get('auth')); 
		if(typeof($cookies.get('auth'))=='string'){
			$scope.show= true;
		}
		else{
			$scope.show= false;
		}
		console.log($scope.show)
	}
	$scope.register = function(){

		if ($scope.k_username == "" || $scope.k_password == "" || $scope.k_password2 == "") {
			alert("Boş bırakmayınız..");
		}
		else if ($scope.k_password != $scope.k_password2) {
			alert("şifreler aynı değil.");
		}
		else{
			var data={
				username:$scope.k_username,
				password:$scope.k_password,
				role:"normal"
			};
			$http.post("http://localhost:3000/api/admin/requests/add",JSON.stringify(data))
			.then(function(resp){

				console.log("resp", resp.data.data)
				if(resp.data.data == true){
				 	$window.alert("istek kaydedildi");
				 	//$window.location.reload();
				}
				else{
				 	$window.alert("Farklı kullanıcı adı giriniz.")
				}
				/*else
				 	$window.alert('Bir sorun oluştu.')
					console.log("AA",resp);*/
			});
			$scope.k_username="";
			$scope.k_password="";
			$scope.k_password2="";
		}
	}

	$scope.signin=function(){

		if ($scope.input_username == "" || $scope.input_password=="") {
			$window.alert("Lütfen alanları doldurunuz.")
		}
		else{
			var data={//if true
			username:$scope.input_username,
			password:$scope.input_password
			};
			console.log("yaz",data);
			$http.post("http://localhost:3000/login",data)
			.then(function(resp){
				//if cookie is already exist ??
				//cookie is not exist define a cookie
				console.log("AA",resp);

				setTimeout(function(){
				  	$window.location.reload();
				});
				if(resp.data.is_user==true){
					$location.path("/");
				}
				if(resp.data.is_admin==true){
					$localStorage.is_admin=true;
				}
			});
		}
	}

	$scope.signout=function(){//if false
		$http.get("http://localhost:3000/logout")
		.then(function(resp){
			if(resp.data.message=='OK'){
				setTimeout(function(){
				  	$window.location.reload();
				});
				$localStorage.$reset();
				$location.path("/");
			}
		});
	}
	$scope.showBtn();
});