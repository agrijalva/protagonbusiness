var Path_Login = API_Path + '/usuario/';

app.factory( 'detalleFactory', function( $http ){
	return {
        login: function( user, pass ) {
            return $http({
                url: Path_Login + 'login/',
                method: "POST",
                params: {
                    user: user,
                    pass: pass
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});