<?php
	include(dirname(__DIR__).'/php/apikeys.php');

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	include('./openCage/AbstractGeocoder.php');
	include('./openCage/Geocoder.php');
	
	$geocoder = new \OpenCage\Geocoder\Geocoder($openCageApiKey);

$result = $geocoder->geocode( $_POST['lat'] . ', ' . $_POST['lon']);

	$searchResult = [];
	$searchResult['open_cage'] = [];

	$temp = [];

	foreach ($result['results'] as $entry) {

		$temp['source'] 	= 'opencage';
		$temp['formatted'] 	= $entry['formatted'] 								?? 'No Data';
		$temp['geometry']	= $entry['geometry']  								?? 'No Data';
		$temp['countryCode']=  strtoupper($entry['components']['country_code']) ?? 'No Data';
		$temp['timezone'] 	= $entry['annotations']['timezone'] 				?? 'No Data';
		$temp['roadinfo'] 	= $entry['annotations']['roadinfo']['drive_on'] 	?? 'No Data';
		$temp['currency'] 	= $entry['annotations']['currency'] 				?? 'No Data';
		$temp['country'] 	= $entry['components']['country'] 					?? 'No Data';

		array_push($searchResult['open_cage'], $temp);
	}

	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($searchResult, JSON_UNESCAPED_UNICODE);
	
	//return full json.....
	//echo json_encode ( $result [ 'results' ], JSON_UNESCAPED_UNICODE);

?>
