<?php
    require 'connect.php';

    $connect = connect();
    
    // Get the data
    $pbars = array();

    $sql = "SELECT circlebar FROM tblusers WHERE user_id = 44";

    if($result = mysqli_query($connect,$sql))
    {
        $count = mysqli_num_rows($result);

        $cr = 0;
        while($row = mysqli_fetch_assoc($result))
        {
            $pbars[$cr]['circlebar']  = $row['circlebar'];

            $cr++;
        }
    }

    $json = json_encode($pbars);
    echo $json;
    exit;

?>