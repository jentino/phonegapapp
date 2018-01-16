<?php
    require 'connect.php';
    echo "<script>alert('Ohaaayy');</script>";
    $connect = connect();

    // Get the data
    $people = array();
    $sql = "SELECT username,firstname,lastname FROM tblusers";

    if($result = mysqli_query($connect,$sql))
    {
    $count = mysqli_num_rows($result);

    $cr = 0;
    while($row = mysqli_fetch_assoc($result))
    {
        $people[$cr]['username']    = $row['username'];
        $people[$cr]['firstname']  = $row['firstname'];
        $people[$cr]['lastname'] = $row['lastname'];

        $cr++;
    }
    }

    $json = json_encode($people);
    echo $json;
    exit;

?>