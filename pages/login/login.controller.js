app.controller("LoginCtrl", ["$scope", "$location","loginFactory", function($scope, $location, loginFactory) {
    $scope.user     = '';
    $scope.pass     = '';

    $scope.nombre       = '';
    $scope.especialidad = '';
    $scope.correo       = '';
    $scope.password     = '';

    $scope.texto = 'Sesión Dos';

    $scope.Login = function(){
        if( $scope.user == '' ){
            swal("Protagon Business","Proporciona tu usuario");
        }
        else if( $scope.pass == '' ){
            swal("Protagon Business","Proporciona tu contraseña");
        }
        else{
            loginFactory.login( $scope.user, $scope.pass ) .then(function(result){
                $scope.datosUser = result.data;
                if( $scope.datosUser.success ){
                    localStorage.setItem("Data_User", JSON.stringify($scope.datosUser.data[0]));
                    $location.path("/admin/agentes");
                }
                else{
                    swal("Protagon Business",$scope.datosUser.msg,"warning");
                }
            }, function(error){
                console.log("Error", error);
            });    
            
        }
    }

    $scope.Registro = function(){
        alert('Alert dentro de la funcion Registro');
    }

    // $scope.submit = function() {
    // 	if( $scope.user == '' && $scope.pass == '' ){
    // 		alert('Asegurate de proporcionar tus credenciales.');
    // 	}
    // 	else if( $scope.user == '' ){
    // 		alert('Proporciona tu usuario para poder acceder al sistema');
    // 	}
    // 	else if( $scope.pass == '' ){
    // 		alert('Proporciona tu contrasema para poder acceder al sistema');
    // 	}
    // 	else{
	   //  	loginFactory.login( $scope.user, $scope.pass ) .then(function(result){
	   //  		var Resultado = result.data;
    //             console.log( Resultado );
	   //  		if( Resultado.success ){
    //                 localStorage.setItem("Data_User", JSON.stringify(Resultado.data[0]));
    //                 $location.path("/admin/agentes");
	   //  		}
	   //  		else{
	   //  			alert( Resultado.msg );
	   //  		}
	   //      }, function(error){
	   //          console.log("Error", error);
	   //      });    		
    // 	}
    // }
}]);