<?php
    require 'connect.php';

    $connect = connect();

    // Get the data
    $balanceamount = array();

    $sql = "SELECT balance FROM tblusers WHERE user_id = 44";

    if($result = mysqli_query($connect,$sql))
    {
        $count = mysqli_num_rows($result);

        $cr = 0;
        while($row = mysqli_fetch_assoc($result))
        {
            $balanceamount[$cr]['balance']  = $row['balance'];

            $cr++;
        }
    }

    $json = json_encode($balanceamount);
    echo $json;
    exit;

?>