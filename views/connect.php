<?php
    $Name = $_POST['Name'];
    $Email = $_POST['Email'];
    $Message = $_POST['Message'];


    //Database connection 
    $conn = new mysqli('localhost','root','','winnie');
    if($conn->$_error){
        die(connection Failed : ' .$conn->connect_error);
    }else{
            $stmt = $conn->prepare("insert into Contact(Name, Email, Message)
                values(?, ?, ?,)");
            $stmt->bind_param(("sss",$Name, Email, Message
        }
?>