<?php
//This file is to be manually run by the Dev.
//it will create the file autocomplete.js which houses the countries varible used by;
//the autocomplete plugin and the dropdown menu.
//nb: dev may need to add "", to index one of array to ensure the box remoains balnk prior to selection
include(dirname(__DIR__).'/php/dbConnection.php');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$sql = " SELECT name_beta FROM restcountries";

$result = mysqli_query($mysqli, $sql); 						

if (mysqli_num_rows($result) > 0) {
    
    $autoComplete = [""];

    while($row = mysqli_fetch_assoc($result)) {
        $temp = $row['name_beta'];

        array_push($autoComplete, $temp);
    };

    $encode = json_encode($autoComplete, JSON_UNESCAPED_UNICODE);
	file_put_contents('../resources/autoComplete.js', 'const autoCountry =  ' . $encode );
    echo $encode;

} else { echo ('error running autoComplete.php');}

mysqli_close($mysqli);

?>
