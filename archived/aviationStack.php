<?php
    $apiKey = 'bb4dbf54397817556387c703cfcd0a68 ';

	$url = 'http://api.aviationstack.com/v1/flights?dep_iata=lgw&access_key=' . $apiKey;
	//$url = 'https://api.opentripmap.com/0.1/en/places/radius?radius=10000&lon=0.1137&lat=51.5049&format=json&apikey=' . $apiKey;
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
	curl_close($ch);

	$decode = json_decode($result,true);

	echo $result

/*
$queryString = http_build_query([
	'access_key' => 'bb4dbf54397817556387c703cfcd0a68'
  ]);
  
  $ch = curl_init(sprintf('%s?%s', 'https://api.aviationstack.com/v1/flights', $queryString));
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  
  $json = curl_exec($ch);
  curl_close($ch);
  
  $api_result = json_decode($json, true);
  echo $json
//   foreach ($api_result['results'] as $flight) {
// 	  if (!$flight['live']['is_ground']) {
// 		  echo sprintf("%s flight %s from %s (%s) to %s (%s) is in the air.",
// 			  $flight['airline']['name'],
// 			  $flight['flight']['iata'],
// 			  $flight['departure']['airport'],
// 			  $flight['departure']['iata'],
// 			  $flight['arrival']['airport'],
// 			  $flight['arrival']['iata']
// 			  ), PHP_EOL;
// 	  }
//   }
*/
?>