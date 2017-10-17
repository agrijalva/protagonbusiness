var Path_Login = API_Path + '/usuario/';

app.factory( 'loginFactory', function( $http ){
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
        },
        registro: function( name, espe, email, pass ) {
            return $http({
                url: Path_Login + 'registro/',
                method: "POST",
                params: {
                    name: name,
                    espe: espe,
                    email: email,
                    pass: pass
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});