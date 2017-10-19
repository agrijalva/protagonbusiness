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
                    nombre: name,
                    espe: espe,
                    email: email,
                    password: pass // estos son los nombres que se envian al back y deben recogerse con el mismo nombre "password"
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});