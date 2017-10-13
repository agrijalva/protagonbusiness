var Path_Empresa = API_Path + '/empresa/';

app.factory( 'empresaFactory', function( $http ){
	return {
        getAreas: function( emp_id, cli_id ) {
            return $http({
                url: Path_Empresa + 'getAreas/',
                method: "POST",
                params: {
                    idEmpresa: emp_id,
                    idCliente: cli_id
                },
                headers: {
                	// 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});