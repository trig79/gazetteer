<?php
//This creates the markers variable and needs to be run each time the airportDB is updated. 
//The airportDB is created from a csv file provided by https://openflights.org/data.html and is a manual process.
//include('./dbConnection.php');
include(dirname(__DIR__).'/php/dbConnection.php');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

//time update tracker.
// $dateDbModified = "covid19DbModified.txt";
// if(!touch($dateDbModified)) {echo ("$dateDbModified has not been update");};

$cache 			= "../cache/airportData.js"; // make this file in same dir

//DB Fetch Data
$sql = "SELECT * FROM airport_data";	
$result = mysqli_query($mysqli, $sql); 						

$arr = [];
// $arr['airport_results'] = [];

	while($row = mysqli_fetch_assoc($result)) {

		$temp['name'] 		= $row['name'];
		$temp['location'] 	= $row['location'];
		$temp['country'] 	= $row['country'];
		$temp['iata3'] 		= $row['iata3'];
		$temp['icao4'] 		= $row['icao4'];
		$temp['lat'] 		= $row['lat'];
		$temp['lon'] 		= $row['lon'];
		$temp['altitude'] 	= $row['altitude'];

		array_push($arr, $temp);
	};

	
	$encode = json_encode($arr, JSON_UNESCAPED_UNICODE);
	file_put_contents($cache, 'const markers = ' . $encode );
echo $encode;

mysqli_close($mysqli);

?>
