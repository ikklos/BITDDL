<?php
$id = $_GET["userid"];
$save = $_GET["save"];
$file = fopen($id . ".bitddl", "w+");
fwrite($file, $save);
fclose($file);
?>