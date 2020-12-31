<?php
	include(dirname(__DIR__).'/php/apikeys.php');	

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$url = 'http://api.timezonedb.com/v2.1/get-time-zone?key=' . $currentTimeApiKey . '&format=json&by=position&lat=' . $_POST['lat'] . '&lng=' . $_POST['lon'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
	curl_close($ch);

	$decode = json_decode($result,true);

    $cleanObj = [];
    $cleanObj['current_time'] = [];
    $temp = [];


		$temp['abbreviation']	= $decode['abbreviation']; 
		$temp['countryCode'] 	= $decode['countryCode']; 
		$temp['dst'] 			= $decode['dst']; 
		$temp['formatted'] 		= $decode['formatted']; 
        $temp['zoneName'] 	    = $decode['zoneName']; 
        
		array_push($cleanObj['current_time'], $temp);


	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($cleanObj, JSON_UNESCAPED_UNICODE);


?>
