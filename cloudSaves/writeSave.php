<?php
$id = $_GET["userid"];
if ($id == "")
    exit(1);
$save = $_GET["save"];
$file = fopen($id . ".bitddl", "w+");
fwrite($file, $save);
fclose($file);
?>