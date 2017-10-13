app.controller("ClientesCtrl", ["$scope", "$location","clienteFactory", "agenteFactory", "empresaFactory","filterFilter", function($scope, $location, clienteFactory, agenteFactory, empresaFactory, filterFilter) {
    $scope.DataUser     = JSON.parse( localStorage.getItem("Data_User") );
    $scope.TotalEje     = 0;
    $scope.eje_mensaje  = 'Debes seleccionar al menos un área para asesoria.';
    $scope.GET          = $location.$$search;
    $scope.cliente = {
        razon: '',
        rfc: '',
        email: '',
        telefono: '',
        celular: '',
        nombre: '',
        tipo: '',
        eje_id: 0
    }

    $scope.Init = function(){
        $scope.getByEmpresa();
    }

    $scope.Init_Nuevo = function(){
        $scope.getCTC();
        $scope.getAreas( 0 );
        $(".razon_social").focus();
    }

    $scope.Init_Detalle = function(){
        $scope.getCTC();
        $(".razon_social").focus();
        $scope.getCliente( $scope.GET['key'] );
    }

    $scope.getCliente = function( key ){
        clienteFactory.getCliente( key ) .then(function(result){
            $scope.ClienteOne = result.data;
            if( $scope.ClienteOne.success ){
                $scope.cliente = {
                    cli_id: $scope.ClienteOne.data[0].cli_id,
                    razon: $scope.ClienteOne.data[0].cli_rason_social,
                    rfc: $scope.ClienteOne.data[0].cli_rfc,
                    email: $scope.ClienteOne.data[0].cli_email,
                    telefono: $scope.ClienteOne.data[0].cli_telefono,
                    celular: $scope.ClienteOne.data[0].cli_celular,
                    nombre: $scope.ClienteOne.data[0].cli_nombre,
                    tipo: $scope.ClienteOne.data[0].ctc_id,
                    eje_id: $scope.ClienteOne.data[0].eje_id
                }

                $scope.getAreas( $scope.ClienteOne.data[0].cli_id );
                agenteFactory.getAgenteById( $scope.ClienteOne.data[0].eje_id ).then(function(result){});
            }
            else{
                // location.href = "#/admin/clientes";
            }
        }, function(error){
            swal("Clientes", "Ocurrio un error: " + error);
        }); 
    }

    $scope.getByEmpresa = function(){
        clienteFactory.getByEmpresa( $scope.DataUser.emp_id ) .then(function(result){
            var Resultado = result.data;
            $scope.Clientes = Resultado.data;
        }, function(error){
            swal("Clientes", "Ocurrio un error: " + error);
        }); 
    }

    $scope.getCTC = function(){
        agenteFactory.catalogoTipoCliente().then(function(result){
            $scope.ctc = result.data.data;
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.SaveCliente = function(){
        if( $scope.cliente.eje_id == 0 ){
            swal({
                title: "Ejecutivo no asignado",
                text: "No se ha seleccionado al ejecutivo que se encargará de este cliente, si no asigna ahora, posteriormente podra asignarselo. <br><br>¿Desea guardarlo sin ejecutivo?",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Guardar",
                cancelButtonText: "No",
                closeOnConfirm: false,
                html: true
            },
            function(){
                $scope.nuevoCliente();
            });
        }else{
            $scope.nuevoCliente();
        }
        
    }

    $scope.nuevoCliente = function(){
        var parametros = {
            emp_id:  $scope.DataUser.emp_id,
            cli_razon_social:     $scope.cliente.razon,
            cli_rfc:       $scope.cliente.rfc,
            cli_email:     $scope.cliente.email,
            cli_telefono:  $scope.cliente.telefono,
            cli_nombre:    $scope.cliente.nombre,
            ctc_id:       $scope.cliente.tipo
        }

        clienteFactory.nuevoCliente( parametros ).then(function(result){
            $scope.Nuevo = result.data;

            if( $scope.Nuevo.success == true || $scope.Nuevo.success == "1" ){
                $scope.Areas.data.forEach( function( item, key ){
                    clienteFactory.asignarArea( $scope.Nuevo.LastId, item.ca_id, (item.checked) ? 1 : 2 );
                });

                agenteFactory.asignarCliente( $scope.cliente.eje_id, $scope.Nuevo.LastId, 1 );
                clienteFactory.sendEmail(parametros.cli_email, parametros.cli_nombre, $scope.Nuevo.pass);

                swal({
                    title: "Cliente",
                    text: $scope.Nuevo.msg,
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                },
                function(){
                    location.href = '#/admin/clientes';
                    // location.href = '#/admin/agente_detalle?key=' + $scope.Ejecutivo.key;
                });
            }
            else{
                swal("Cliente", $scope.Nuevo.msg);
            }
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.actualizaCliente = function(){
        var parametros = {
            cli_id:  $scope.cliente.cli_id,
            cli_razon_social:     $scope.cliente.razon,
            cli_rfc:       $scope.cliente.rfc,
            cli_telefono:  $scope.cliente.telefono,
            cli_celular:   $scope.cliente.celular,
            cli_nombre:    $scope.cliente.nombre,
            ctc_id:       $scope.cliente.tipo
        }

        clienteFactory.actualizaCliente( parametros ).then(function(result){
            $scope.Nuevo = result.data;

            if( $scope.Nuevo.success == true || $scope.Nuevo.success == "1" ){
                $scope.Areas.data.forEach( function( item, key ){
                    clienteFactory.asignarArea( $scope.cliente.cli_id, item.ca_id, (item.checked) ? 1 : 2 );
                });

                agenteFactory.asignarCliente( $scope.cliente.eje_id, $scope.cliente.cli_id, 1 );

                swal({
                    title: "Cliente",
                    text: $scope.Nuevo.msg,
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                },
                function(){
                    location.href = '#/admin/clientes';
                    // location.href = '#/admin/agente_detalle?key=' + $scope.Ejecutivo.key;
                });
            }
            else{
                swal("Cliente", $scope.Nuevo.msg);
            }
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.goDetalle = function( key ){
        location.href = "#/admin/cliente_detalle?key=" + key ;
    }

    $scope.getAreas = function( cli_id ){
        empresaFactory.getAreas( $scope.DataUser.emp_id, cli_id ).then(function(result){
            $scope.Areas = result.data;

            $scope.Areas.data.forEach( function( item, key ){
                if( cli_id == 0 ){
                    $scope.Areas.data[ key ].checked = false;
                }
                else{
                    if( parseInt(item.checked) == 0 ){
                        $scope.Areas.data[ key ].checked = false;
                    }
                    else{
                        $scope.Areas.data[ key ].checked = true;
                    }

                    // $scope.GetEjecutivos();
                    if( key == ($scope.Areas.data.length - 1) ){
                        $scope.GetEjecutivosByCliente();                        
                    }
                }
            });
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.GetEjecutivos = function(){
        $scope.ArSel = filterFilter( $scope.Areas.data , {checked: true} );      

        var seleccionados = [];
        $scope.ArSel.forEach( function( item, key ){
            seleccionados.push( item.ca_id );
        });

        var sAreas = seleccionados.join(',');
        $scope.TotalEje = $scope.ArSel.length;

        agenteFactory.getByArea( $scope.DataUser.emp_id, sAreas ).then(function(result){
            $scope.Ejecutivos = result.data;
            if( !$scope.Ejecutivos.success ){
                $scope.TotalEje = 0;
                if( $scope.ArSel.length == 0 ){
                    $scope.eje_mensaje  = 'Debes seleccionar al menos un área para asesoria.';
                }
                else{
                    $scope.eje_mensaje = 'No hay ejecutivos para el área seleccionada.';
                }
            }
            else{
                $scope.TotalEje = 1;
            }
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.GetEjecutivosByCliente = function(  ){
        $scope.ArSel = filterFilter( $scope.Areas.data , {checked: true} );
        $scope.ClienteOne.data[0].eje_id = $scope.ClienteOne.data[0].eje_id === undefined ? 0 : $scope.ClienteOne.data[0].eje_id;

        var seleccionados = [];
        $scope.ArSel.forEach( function( item, key ){
            seleccionados.push( item.ca_id );
        });

        var sAreas = seleccionados.join(',');
        $scope.TotalEje = $scope.ArSel.length;
        console.log( $scope.DataUser.emp_id, sAreas,$scope.ClienteOne.data[0].eje_id );
        agenteFactory.getByAreaAndCustomer( $scope.DataUser.emp_id, sAreas,$scope.ClienteOne.data[0].eje_id ).then(function(result){
            $scope.Ejecutivos = result.data;
            console.log( $scope.Ejecutivos );
            if( !$scope.Ejecutivos.success ){
                $scope.TotalEje = 0;
                if( $scope.ArSel.length == 0 ){
                    $scope.eje_mensaje  = 'Debes seleccionar al menos un área para asesoria.';
                }
                else{
                    $scope.eje_mensaje = 'No hay ejecutivos para el área seleccionada.';
                }
            }
            else{
                $scope.TotalEje = 1;
            }
        }, function(error){
            console.log("Error", error);
        });
    }
}]);