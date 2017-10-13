app.controller("AgentesCtrl", ["$scope", "$location","agenteFactory", "empresaFactory","filterFilter", function($scope, $location, agenteFactory, empresaFactory, filterFilter) {
    $scope.DataUser     = JSON.parse( localStorage.getItem("Data_User") );
    $scope.Ejecutivos   = [];
    $scope.clientes     = [];
    $scope.dataCliente  = [];
    $scope.frmInfo      = [];
    $scope.GET          = $location.$$search;
    $scope.eje_id       = 0;
    $scope.cat_clientes = [];
    $scope.ctc          = [];

    console.log( $scope.DataUser );
    $scope.ejecutivo    = {
            emp_id: $scope.DataUser.emp_id,
            email: "",
            telefono: "",
            celular: "",
            nombre: ""
        };

    $scope.Init = function(){
        $scope.LoadEjecutivos();
        $('.carrucel').slick({
            // setting-name: setting-value
        });
    }

    $scope.Init_Detalle = function(){
        $scope.LoadDataEjecutivo( $scope.GET['key'] );
    }

    $scope.Init_Nuevo = function(){
        $(".nombre_completo").focus();
    }

    $scope.goDetalle = function( key ){
        location.href = "#/admin/agente_detalle?key=" + key ;
    }

    $scope.LoadEjecutivos = function(){
        agenteFactory.getAgentes( $scope.DataUser.emp_id, 0 ) .then(function(result){
            var Resultado = result.data;
            $scope.Ejecutivos = Resultado.data;

            $scope.Ejecutivos.forEach( function( item, key ){
                if( item.Areas.length != 0 ){
                    var areasActivas = filterFilter( item.Areas , {ejar_estatus: 1} );
                    $scope.Ejecutivos[ key ].areasActivas = areasActivas.length;
                }
                else{
                    $scope.Ejecutivos[ key ].areasActivas = 0;   
                }
            });
            // $scope.DataTable( 'example' );
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.DataTable = function( id ){
        setTimeout( function(){
            $('#' + id).DataTable().destroy();
            $('#' + id).DataTable({
                language: {
                    url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
                },
                iDisplayLength: 25,
                searching: true,
                bLengthChange: false,
            });
        },1000 );
    }

    $scope.OMAsignarCliente = function( id ){
        alert('Hola, soy asignar cliente ' + id);
    }

    $scope.LoadDataEjecutivo = function( key ){
        agenteFactory.getAgenteByKey( key ) .then(function(result){
            var Resultado = result.data;
            $scope.dataCliente = Resultado.data[0];
            // console.log( $scope.dataCliente.eje_id );

            if( $scope.dataCliente.Areas.length != 0 ){
                var areasActivas = filterFilter( $scope.dataCliente.Areas , {ejar_estatus: 1} );
                $scope.dataCliente.areasActivas = areasActivas.length;
            }
            else{
                $scope.dataCliente.areasActivas = 0;   
            }

            if( Resultado.success ){
                $scope.clientes = Resultado.data[0].Clientes;
            }
        }, function(error){
            console.log("Error", error);
        }); 
    }

    $scope.editarInfo = function(){
        $scope.alert_info = { show:false, type: 'success', title:'Listo', msg: '' };
        $('#modal_informacion').modal('show');
        $scope.frmInfo = { idEjecutivo: $scope.dataCliente.eje_id,
                           eje_nombre: $scope.dataCliente.eje_nombre,
                           eje_email: $scope.dataCliente.eje_email,
                           eje_telefono: $scope.dataCliente.eje_telefono,
                           eje_celular: $scope.dataCliente.eje_celular
                        }

    }

    $scope.DeshabilitarEjecutivo = function(){
        swal({
            title: "¿Estas seguro?",
            text: "Al deshabilitar este ejecutivo ya no tendra accesos a las herramientas, esta operación es reversible",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        },
        function(){
            var idEje = $scope.dataCliente.eje_id;
            agenteFactory.cambiaEstatus( idEje, 2 ) .then(function(result){
                var Resultado = result.data;
                if( Resultado.success ){
                    $scope.dataCliente.ese_id = 2;
                    swal("Deshabilitado", "Este agente puede ser habilitado posterioemente", "success");
                }
                else{
                    swal("Deshabilitar ejecutivo", Resultado.msg , "info");   
                }
            }, function(error){
                console.log("Error", error);
            });
        });
    }

    $scope.ActivarEjecutivo = function(){
        swal({
            title: "¿Estas seguro?",
            text: "Al activar este ejecutivo, éste ya podra acceder a su paner de operación",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Activar",
            cancelButtonText: "No",
            closeOnConfirm: false
        },
        function(){
            var idEje = $scope.dataCliente.eje_id;
            agenteFactory.cambiaEstatus( idEje, 3 ) .then(function(result){
                var Resultado = result.data;
                if( Resultado.success ){
                    $scope.dataCliente.ese_id = 3;
                    swal("Ejecutivo activado", "Se ha mandado un correo al ejecutivo indicando instrucciones para entrar a su panel.", "success");
                }
                else{
                    swal("Activar", Resultado.msg , "info");   
                }
            }, function(error){
                console.log("Error", error);
            });
        });
    }

    $scope.updateInfo = function(){
        agenteFactory.updateInfo( $scope.frmInfo ) .then(function(result){
            var Resultado = result.data;

            if( Resultado.success ){
                $scope.alert_info = { show:true, type: 'success', title:'Listo', msg: Resultado.msg };

                setTimeout( function(){
                    $('#modal_informacion').modal('hide');
                },3000 );
                $scope.dataCliente.eje_id       = $scope.frmInfo.idEjecutivo;
                $scope.dataCliente.eje_nombre   = $scope.frmInfo.eje_nombre;
                $scope.dataCliente.eje_email    = $scope.frmInfo.eje_email;
                $scope.dataCliente.eje_telefono = $scope.frmInfo.eje_telefono;
                $scope.dataCliente.eje_celular  = $scope.frmInfo.eje_celular;
            }
            else{
                $scope.alert_info = { show:true, type: 'warning', title:'Avertencia', msg: Resultado.msg };
            }

        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.getAreaByEmpresa = function(){
        empresaFactory.getAreas( $scope.DataUser.emp_id,0 ) .then(function(result){
            $scope.areas = result.data.data;
            console.log( $scope.dataCliente );
            $scope.areas.forEach( function( item, key ){
                $scope.val = filterFilter( $scope.dataCliente.Areas , {ca_id: item.ca_id} );
                if( $scope.val.length == 0 ){
                    $scope.areas[ key ].checked = false;
                }
                else{
                    $scope.areas[ key ].estatus = $scope.val[0].ejar_estatus;
                    if( $scope.val[0].ejar_estatus == 1 ){
                        $scope.areas[ key ].checked = true;
                    }
                    else{
                        $scope.areas[ key ].checked = false;
                    }
                }

                if( $scope.areas[ key ].checked ){
                    $scope.cli = filterFilter( $scope.dataCliente.AreasClientes , {ca_id: item.ca_id} );
                    if( $scope.cli == 0 ){
                        $scope.areas[ key ].disabled = false;
                    }
                    else{
                        $scope.areas[ key ].disabled = true;
                        $scope.areas[ key ].mensaje  = '<span class="label label-warning">Existen clientes con esta área asignada</span>';
                    }
                }
                else{
                    $scope.areas[ key ].disabled = false;
                }
            });

            $scope.alert_info = { show:false, type: 'success', title:'Listo', msg: '' };
            $('#modal_areas').modal('show');
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.AsignarAreas = function(){
        $scope.areas.forEach( function( item, key ){
            var estatus = item.checked ? 1 : 2;
            agenteFactory.asignarArea( $scope.dataCliente.eje_id, item.ca_id, estatus ).then(function(result){
                item.mensaje = '<span class="label label-'+ result.data.data[0].label +'">' + result.data.data[0].msg + '</span>';
                $scope.Init_Detalle();
            }, function(error){
                console.log("Error", error);
            });
        });
    }

    $scope.getClientes = function(){
        $scope.alert_info = { show:false, type: 'success', title:'Listo', msg: '' };
        agenteFactory.byEmpresa( $scope.dataCliente.emp_id ).then(function(result){
            if( result.data.success ){
                result.data.data.forEach( function(item, key){
                    var asignados = filterFilter( $scope.dataCliente.Clientes , {cli_id: item.cli_id} ) ;
                    result.data.data[ key ].asignado = asignados.length == 0 ? false : true;

                    if( item.idEjecutivo == $scope.dataCliente.eje_id ){
                        result.data.data[ key ].disabled = false;
                    }
                    else{
                        if( item.idEjecutivo == 0 ){
                            result.data.data[ key ].disabled = false;
                        }
                        else{
                            result.data.data[ key ].disabled = true;
                        }
                    }

                    var match = 0;
                    item.Areas.forEach( function( cli_area, llave ){
                        filterFilter( $scope.dataCliente.Areas , {ejar_estatus: 1} ).forEach( function( eje_area, k){
                            if( cli_area.ca_id == eje_area.ca_id ){
                                match++;                                
                            }

                            if( llave == (item.Areas.length - 1) ){
                                if( k == ( filterFilter( $scope.dataCliente.Areas , {ejar_estatus: 1} ).length - 1 ) ){
                                    result.data.data[ key ].match = match == 0 ? 0 : 1;
                                    $scope.cat_clientes = result.data.data;
                                    console.log( $scope.cat_clientes );
                                }
                            }
                        });
                    });
                });

                var areasActivas = filterFilter( result.data.data , {ejar_estatus: 1} );
            }
            $('#modal_clientes').modal('show');
        }, function(error){
            console.log("Error", error);
        });
    }

    $scope.asignarCliente = function(){
        $scope.cat_clientes.forEach( function( item, key ){
            var estatus = item.asignado ? 1 : 2;
            agenteFactory.asignarCliente( $scope.dataCliente.eje_id, item.cli_id, estatus ).then(function(result){
                item.mensaje = '<span class="label label-'+ result.data.data[0].label +'">' + result.data.data[0].msg + '</span>';
                $scope.Init_Detalle();
            }, function(error){
                console.log("Error", error);
            });
        });
    }

    $scope.mayor = function(prop, val){
        return function(item){
          return item[prop] > val;
        }
    }

    $scope.SaveEjecutivo = function(){
        agenteFactory.nuevoEjecutivo($scope.ejecutivo.emp_id, $scope.ejecutivo.email, $scope.ejecutivo.telefono, $scope.ejecutivo.celular, $scope.ejecutivo.nombre).then(function(result){
            $scope.Ejecutivo = result.data;
            agenteFactory.sendEmail($scope.ejecutivo.email, $scope.ejecutivo.nombre, $scope.Ejecutivo.pass);

            swal({
                title: "Ejecutivo",
                text: $scope.Ejecutivo.msg,
                showCancelButton: false,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: true
            },
            function(){
                if( $scope.Ejecutivo.success == true || $scope.Ejecutivo.success == "1" ){
                    console.log('key', $scope.Ejecutivo.key);
                    location.href = '#/admin/agente_detalle?key=' + $scope.Ejecutivo.key;
                }
            });
        }, function(error){
            console.log("Error", error);
        }); 
    }
}]);