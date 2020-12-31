<?php
	
	include(dirname(__DIR__).'/php/apikeys.php');	

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$url='api.openweathermap.org/data/2.5/weather?q=' . $_REQUEST['city'] . '&units=metric&appid=' . $openWeatherApiKey;

	$ch = curl_init();
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
	curl_close($ch);

	$decode = json_decode($result,true);	

	$searchResults = [];
	$searchResults['open_weather'] = [];

		$temp = [];

		$temp['source'] 		= 'Open Weather';
		$temp['icon'] 			= $decode['weather'][0]['icon'];
		$temp['name'] 			= $decode['name'];
		$temp['description']	= $decode['weather'][0]['description'];
		$temp['temp_c'] 		= $decode['main']['temp'];
		$temp['coord']['lat'] 	= $decode['coord']['lat'];
		$temp['coord']['lon'] 	= $decode['coord']['lon'];

		array_push($searchResults['open_weather'], $temp);

	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($searchResults, JSON_UNESCAPED_UNICODE); 
	
?>
