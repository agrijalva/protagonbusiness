var Path_Ejecutivo = API_Path + '/ejecutivo/';
var Path_Cliente = API_Path + '/cliente/';
var Path_Correos = API_Path + '/correos/';

app.factory( 'clienteFactory', function( $http ){
	return {
        getByEmpresa: function( emp_id ) {
            return $http({
                url: Path_Cliente + 'byEmpresa/',
                method: "POST",
                params: {
                    idEmpresa: emp_id
                },
                headers: {
                	// 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        nuevoCliente: function( parametros ) {
            return $http({
                url: Path_Cliente + 'nuevoCliente/',
                method: "POST",
                params: parametros,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizaCliente: function( parametros ) {
            return $http({
                url: Path_Cliente + 'actualizaCliente/',
                method: "POST",
                params: parametros,
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        asignarArea: function( idCliente, idArea, Estatus ) {
            return $http({
                url: Path_Cliente + 'asignarArea/',
                method: "POST",
                params: {
                    cli_id:  idCliente,
                    ca_id:   idArea,
                    Estatus: Estatus
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        getCliente: function( key ) {
            return $http({
                url: Path_Cliente + 'getCliente/',
                method: "POST",
                params: {
                    key: key
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        },
        sendEmail: function(email, nombre, password) {
            return $http({
                url: Path_Correos + 'SendMail/',
                method: "POST",
                params: {
                    ToEmail:  email,
                    ToName:   nombre,
                    Subject:  'Bienvenido a nuestra plataforma',
                    template: 'cli.wellcome',
                    password: password
                },
                headers: {
                    // 'Authorization': Authorization,
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});