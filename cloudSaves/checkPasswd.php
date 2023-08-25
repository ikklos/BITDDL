<?php
$passwd = $_GET["userpasswd"];
$id = $_GET["userid"];

$file = fopen("passwdbase.csv", "r");
while (!feof($file)) {
    $arr = fgetcsv($file);
    if ($id == $arr[0]) {
        if ($passwd == $arr[1])
            echo "Verified";
        else
            echo "Wrong";
        return;
    }
}
fclose($file);
echo "Unknown";
?>