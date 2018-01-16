<?php
    require 'connect.php';

    $connect = connect();

    // Get the data
    $people = array();
    $sql = "SELECT firstname,lastname,balance,circlebar FROM tblusers WHERE user_id=44";

    if($result = mysqli_query($connect,$sql))
    {
        $count = mysqli_num_rows($result);

        $cr = 0;
        while($row = mysqli_fetch_assoc($result))
        {
            $people[$cr]['balance']    = $row['balance'];
            $people[$cr]['firstname']  = $row['firstname'];
            $people[$cr]['lastname'] = $row['lastname'];
            $people[$cr]['circlebar'] = $row['circlebar'];

            $cr++;
        }
    }

    $json = json_encode($people);
    echo $json;
    exit;

?>