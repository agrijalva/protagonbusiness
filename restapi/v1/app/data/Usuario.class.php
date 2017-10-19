<?php
class Usuario
{
	var $Return_Type;
	var $conn;

	var $user;
	var $pass;
	var $nombre;
	var $password;

	public function __construct( $Class_Properties = array() ) {
		$this->Assign_Properties_Values($Class_Properties);
		$this->conn = new Connection();
		$this->Return_Type = 'json';
	}

	public function login(){
		$_response['success'] = false;
		if( empty( $this->user ) && empty( $this->pass ) ){
			$_response['msg']     	= 'Favor de proporcionar tus credenciales';
		}
		else if( empty( $this->user ) ){
			$_response['msg']     	= 'Proporciona tu usuario';
		}
		else if( empty( $this->pass ) ){
			$_response['msg']     	= 'Proporciona tu password';
		}
		else{
			$params = array(
					'_email' 	=> array( 'value' => $this->user, 'type' => 'STRING' ),
					'_password' => array( 'value' => $this->pass, 'type' => 'STRING' ),
					'_origen' 	=> array( 'value' => '{test:test}', 'type' => 'STRING' ),
					'_ip' 		=> array( 'value' => '192.168.0.2', 'type' => 'STRING' )
				);

			$_result = $this->conn->Query( "LOG_SEL_PROTAGONISTA_SP", $params );

			if( !empty( $_result ) ){
				if( isset( $_result[0]['success'] ) ){
					$_response['msg'] = $_result[0]['msg'];
				}
				else{
					$_response['success'] 	= true;
					$_response['msg']     	= 'Registros encontrados: ' . count( $_result );
					$_response['data'] 		= $_result[0];
				}
			}
			else{
				$_response['msg']     	= 'No se encontraron resultados para tu solicitud.';	
			}			
		}
		
		return $this->Request( $_response );
	}


	public function registro(){
		$_response['success'] = false;
		if ( !filter_var( $this->email , FILTER_VALIDATE_EMAIL) ){
			$_response['msg'] = 'Favor de proporcionar email valido';
		}
		else{
			$params = array(
					'_nombre' 			=> array( 'value' => $this->nombre, 'type' => 'STRING' ),
					'_email' 			=> array( 'value' => $this->email, 'type' => 'STRING' ),
					'_password' 		=> array( 'value' => $this->password, 'type' => 'STRING' ),
					'idEspecialidad' 	=> array( 'value' => '1', 'type' => 'STRING' ),
					'_origen' 			=> array( 'value' => '{test:test}', 'type' => 'STRING' ),
					'_ip' 				=> array( 'value' => '192.168.0.2', 'type' => 'STRING' )
				);

			$_result = $this->conn->Query( "PRO_INS_REGISTRO_SP", $params );
			if ( $_result[0]['msg'] == 1) {
				$_response['success'] 	= true;
				$_response['msg'] = $_result[0]['msg'];
				$_response['data'] 		= $_result[0];
			}else{
				$_response['success'] 	= false;
				$_response['msg'] = $_result[0]['msg'];
			}
					
				
		}
		
		return $this->Request( $_response );
	}

	public function login_cliente(){
		$_response['success'] = false;
		if( empty( $this->user ) && empty( $this->pass ) ){
			$_response['msg']     	= 'Favor de proporcionar tus credenciales';
		}
		else if( empty( $this->user ) ){
			$_response['msg']     	= 'Proporciona tu email';
		}
		else if( empty( $this->pass ) ){
			$_response['msg']     	= 'Proporciona tu password';
		}
		else{
			$params = array(
					'user' => array( 'value' => $this->user, 'type' => 'STRING' ),
					'pass' => array( 'value' => $this->pass, 'type' => 'STRING' )
				);

			$_result = $this->conn->Query( "CLI_LOGIN_SP", $params );

			if( !empty( $_result ) ){
				$_response['success'] 	= true;
				$_response['msg']     	= 'Registros encontrados: ' . count( $_result );
				$_response['data'] 		= $_result;
			}
			else{
				$_response['msg']     	= 'No se encontraron resultados para tu solicitud.';	
			}			
		}
		
		return $this->Request( $_response );
	}

	private function Assign_Properties_Values($Properties_Array){
		if (is_array($Properties_Array)) {
			foreach($Properties_Array as $Property_Name => $Property_Value)  {
				$this->{$Property_Name} = trim(htmlentities($Property_Value, ENT_QUOTES, 'UTF-8'));
			}
		}
	}

	private function Request( $_array ){
		if( empty( $this->Return_Type ) ){
			return $_array;			
		}
		else if( $this->Return_Type == 'json'  || $this->Return_Type == 'JSON' ){
			print_r( json_encode( $_array ) );
		}
	}
}
?>