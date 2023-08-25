<?php
$id = $_GET["userid"];
if ($file = fopen($id . ".bitddl", "r")) {
    $ret = fgets($file);
    echo $ret;
    fclose($file);
} else {
    http_response_code(404);
}
?>