<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "cookies", "povertyalleviatordb");

$result = $conn->query("SELECT pbar FROM Customers WHERE user_id = '44'");

$outp = "";
while($rs = $result->fetch_array(MYSQLI_ASSOC)) {
    if ($outp != "") {$outp .= ",";}
    $outp .=  $rs["pbar"];
}
$outp ='{"pbarvalue":['.$outp.']}';
$conn->close();

echo($outp);
?>