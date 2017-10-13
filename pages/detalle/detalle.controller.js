app.controller("DetalleCtrl", ["$scope", "$location","detalleFactory", function($scope, $location, detalleFactory) {
    $scope.User_Data = localStorage.getItem('Data_User');
    $scope.User_Data = JSON.parse( $scope.User_Data );

    $scope.nombre = $scope.User_Data.pro_nombre;
    // console.log( 'User_Data', $scope.User_Data );
}]);