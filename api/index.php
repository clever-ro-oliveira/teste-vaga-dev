<?php

require 'flight/Flight.php';

header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");


# Database Information #
Flight::register('db', 'PDO', ['mysql:host=localhost;port=3306;dbname=magis', 'cleverson', 'FeIo2023!']);

define('CONN', Flight::db());

Flight::route('/', function () {
    echo 'hello world!';
});

/**
 * Listar todas as empresas.
 */
Flight::route('GET /listar', function () {
    $data = CONN->query("SELECT id, cnpj, empresa FROM empresas ORDER BY empresa, cnpj");
    $return = [];
    while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
        $return[] = $row;
    }

    Flight::json($return);
});

/**
 * Buscar os dados de uma empresa específica.
 * Usado para carregar os dados para edição.
 */
Flight::route('GET /empresa/@id', function ($id) {
    $data = CONN->query("SELECT * FROM empresas WHERE id = '$id'")
    ->fetch(PDO::FETCH_ASSOC);

    Flight::json($data);
});

/**
 * Cadastrar/Editar empresa.
 */
Flight::route('POST /edicao/@id', function ($id) {
    //Verifica se a empresa existe no BD.
    $data = CONN->query("SELECT id FROM empresas WHERE id = '$id'")
    ->fetch(PDO::FETCH_ASSOC);

    if(!$data) {
        Flight::json(['msg' => 'Empresa não cadastrada!']);
    }
    else {

        $body = Flight::request()->getBody();
        $obj = json_decode($body);
        $fields = [
            'id' => $id,
            'cnpj' => $obj->cnpj,
            'empresa' => $obj->empresa,
            'cep' => $obj->cep,
            'endereco' => $obj->endereco,
            'numero' => $obj->numero,
            'bairro' => $obj->bairro,
            'estado' => $obj->estado,
            'cidade' => $obj->cidade
        ];

        $sql = "UPDATE empresas SET
            cnpj=:cnpj,
            empresa=:empresa,
            cep=:cep,
            endereco=:endereco,
            numero=:numero,
            bairro=:bairro,
            estado=:estado,
            cidade=:cidade
        WHERE id=:id";

        CONN->prepare($sql)->execute($fields);

        //Retorna o resultado para atualizar o state
        $data = CONN->query("SELECT * FROM empresas WHERE id = '$id'")
        ->fetch(PDO::FETCH_ASSOC);

        Flight::json($data);
        
    }
});


Flight::route('POST /cadastro', function () {
    $body = Flight::request()->getBody();
    $obj = json_decode($body);
    
    $fields = [
        'cnpj' => $obj->cnpj,
        'empresa' => $obj->empresa,
        'cep' => $obj->cep,
        'endereco' => $obj->endereco,
        'numero' => $obj->numero,
        'bairro' => $obj->bairro,
        'estado' => $obj->estado,
        'cidade' => $obj->cidade
    ];

    // Verifica o CNPJ para evitar duplicidade.
    $data = CONN->query("SELECT id FROM empresas WHERE cnpj = '$obj->cnpj'")
    ->fetch(PDO::FETCH_ASSOC);
    if($data) {
        Flight::json(['msg' => 'Já existe uma empresa cadastrada com este CNPJ.']);
    }
    else {
        $sql = "INSERT INTO empresas
            (cnpj, empresa, cep, endereco, numero, bairro, estado, cidade)
        VALUES
            (:cnpj, :empresa, :cep, :endereco, :numero, :bairro, :estado, :cidade)";

        CONN->prepare($sql)->execute($fields);

        //Retorna o resultado para atualizar o state
        $data = CONN->query("SELECT * FROM empresas WHERE cnpj = '$obj->cnpj'")
        ->fetch(PDO::FETCH_ASSOC);

        Flight::json($data);
    }

});

Flight::start();
