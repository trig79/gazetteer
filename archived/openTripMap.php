<?php
    $apiKey = '5ae2e3f221c38a28845f05b6d98d41d2deae7f64145d55c3e0f494d4 ';

	$url = 'https://api.opentripmap.com/0.1/en/places/radius?radius=1000&lon=0.1137&lat=51.5049&apikey=' . $apiKey;
	//$url = 'https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=0.1137&lat=51.5049&format=json&apikey=' . $apiKey;
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
	curl_close($ch);

	$decode = json_decode($result,true);

	echo $result

?>