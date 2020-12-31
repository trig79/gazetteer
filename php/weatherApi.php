<?php
	include(dirname(__DIR__).'/php/apikeys.php');		
		
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$ch = curl_init();
	
	$requestedCity = curl_escape($ch, $_REQUEST['city']);
	//3 Day Forecast 
	$forecastWxUrl='https://api.weatherapi.com/v1/forecast.json?key=' . $weatherApi . '&q=' . $requestedCity . '&days=3';
	
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_URL,$forecastWxUrl);

	$forecastWxResult=curl_exec($ch);
	curl_close($ch);

	$forecastWxDecode = json_decode($forecastWxResult,true);	

	$searchResults = [];
	$searchResults['weatherApi'] = [];

		$temp = [];

		$temp['current_weather']['date'] 			= $forecastWxDecode['current']['last_updated'];
		$temp['current_weather']['icon'] 			= $forecastWxDecode['current']['condition']['icon'];
		$temp['current_weather']['name'] 			= $forecastWxDecode['location']['name'];
		$temp['current_weather']['description']		= $forecastWxDecode['current']['condition']['text'];
		$temp['current_weather']['temp_c'] 			= $forecastWxDecode['current']['temp_c'];
		$temp['current_weather']['temp_f'] 			= $forecastWxDecode['current']['temp_f'];
		$temp['current_weather']['feelslike_c'] 	= $forecastWxDecode['current']['feelslike_c'];
		$temp['current_weather']['feelslike_f'] 	= $forecastWxDecode['current']['feelslike_f'];
		$temp['current_weather']['coord']['lat'] 	= $forecastWxDecode['location']['lat'];
		$temp['current_weather']['coord']['lon'] 	= $forecastWxDecode['location']['lon'];
		$temp['current_weather']['wind_mph']	 	= $forecastWxDecode['current']['wind_mph'];
		$temp['current_weather']['wind_kph']	 	= $forecastWxDecode['current']['wind_kph'];
	
		array_push($searchResults['weatherApi'], $temp);

		for ($i = 0; $i < 3; $i++ ){

			$temp=[];

			$temp['forecast'][$i]['date']				= $forecastWxDecode['forecast']['forecastday'][$i]['date'];

			$temp['forecast'][$i]['astro']['sunrise']	= $forecastWxDecode['forecast']['forecastday'][$i]['astro']['sunrise'];
			$temp['forecast'][$i]['astro']['sunset']	= $forecastWxDecode['forecast']['forecastday'][$i]['astro']['sunset'];

			$temp['forecast'][$i]['day']['maxtemp_c']	= $forecastWxDecode['forecast']['forecastday'][$i]['day']['maxtemp_c'];
			$temp['forecast'][$i]['day']['maxtemp_f']	= $forecastWxDecode['forecast']['forecastday'][$i]['day']['maxtemp_f'];
			$temp['forecast'][$i]['day']['mintemp_c']	= $forecastWxDecode['forecast']['forecastday'][$i]['day']['mintemp_c'];
			$temp['forecast'][$i]['day']['mintemp_f']	= $forecastWxDecode['forecast']['forecastday'][$i]['day']['mintemp_f'];
			$temp['forecast'][$i]['condition']['code']	= $forecastWxDecode['forecast']['forecastday'][$i]['day']['condition']['code'];
			$temp['forecast'][$i]['condition']['icon']	= $forecastWxDecode['forecast']['forecastday'][$i]['day']['condition']['icon'];
			$temp['forecast'][$i]['condition']['text']	= $forecastWxDecode['forecast']['forecastday'][$i]['day']['condition']['text'];

			array_push($searchResults['weatherApi'], $temp);
		}

		//array_push($searchResults['weatherApi'], $temp);

	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($searchResults, JSON_UNESCAPED_UNICODE); 
	//echo json_encode($forecastWxDecode, JSON_UNESCAPED_UNICODE); 
		
?>
