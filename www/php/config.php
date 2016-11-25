<?php
    
    $link = mysql_connect('localhost', 'root', 'admin');
    $db = mysql_select_db('findfooddb');

    if(!$link){
        echo "Erro ao conectar ao banco de dados.";
        exit();          
    }else{
        echo "Conexão realizada com sucesso!";
    }

?>
