<?php
//include('./dbConnection.php');
include(dirname(__DIR__).'/php/dbConnection.php');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

//time update tracker.
$dateDbModified = "restCountriesDbModified.txt";
if(!touch($dateDbModified)) {echo ("$dateDbModified has not been update");};

$force_refresh	= false; // dev
$refresh		= 60*60; // once an hr 

// DB REFRESH. Nb. will only register a modified date in mySQL if something has changed.
if ($force_refresh || ((time() - filemtime($dateDbModified)) > ($refresh))) { //|| 0 == filesize($cache) || ((time() - filemtime($cache)
	
	$url = 'https://restcountries.eu/rest/v2/all';
	
	$ch = curl_init();
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
	curl_close($ch);

	$decode = json_decode($result,true);

	foreach ($decode as $entry) {

		$temp['alpha2code'] 	= strtoupper($entry['alpha2Code']) 							?? 'No Data';
		$temp['alpha3code'] 	= strtoupper($entry['alpha3Code']) 							?? 'No Data';
		$temp['name'] 			= $mysqli -> real_escape_string(strtolower($entry['name'])) ?? 'No Data';
		$temp['capital'] 		= $mysqli -> real_escape_string(strtolower($entry['capital'])) ?? 'No Data';
		$temp['population'] 	= $entry['population'] 										?? 0;
		$temp['area'] 			= $entry['area'] 											?? 0;
		$temp['currencyCode'] 	= $entry['currencies'][0]['code'] 							?? 'No Data';
		$temp['currencySymbol'] = $entry['currencies'][0]['symbol'] 						?? 'No Data';
		$temp['flag'] 			= $entry['flag'] 											?? 'No Data';

		$sql = "INSERT INTO `restcountries` (`alpha2code`, `alpha3code`, `name`, `capital`, `population`, `area`, `currencyCode`, `currencySymbol`, `flag`)
		VALUES ('{$temp['alpha2code']}',
				'{$temp['alpha3code']}',
				'{$temp['name']}',
				'{$temp['capital']}',
				'{$temp['population']}',
				'{$temp['area']}',
				'{$temp['currencyCode']}',
				'{$temp['currencySymbol']}',
				'{$temp['flag']}')
		ON DUPLICATE KEY UPDATE 
			`alpha2code` 	= VALUES(`alpha2code`),
			`alpha3code`	= VALUES(`alpha3code`),
			`name`			= VALUES(`name`),
			`capital`		= VALUES(`capital`),
			`population`	= VALUES(`population`),
			`area`			= VALUES(`area`),
			`currencyCode`	= VALUES(`currencyCode`),
			`currencySymbol`= VALUES(`currencySymbol`),
			`flag`			= VALUES(`flag`)";
			
	mysqli_query($mysqli, $sql); 						

	}

} 

//DB Fetch Data
$countryReq = $_REQUEST['country'];
$countryCodeReq = $_REQUEST['countryCode'];
$function = $_REQUEST['functionCalled'];

if ($function == 'countrySearch') {
	$sql_a = "	SELECT * FROM restcountries	WHERE name_beta = '$countryReq'";
} else if ($function == 'latLonSearch') {
	$sql_a = "	SELECT * FROM restcountries	WHERE alpha2code = '$countryCodeReq'";
}

$result_a = mysqli_query($mysqli, $sql_a); 						

if (mysqli_num_rows($result_a) > 0) {

	$searchResult_a = [];
	$searchResult_a['rest_countries'] = [];

	while($row = mysqli_fetch_assoc($result_a)) {
		$temp = [];

		//foreach ($test as $entry) {

		$temp['source'] 		= 'restCountries';
		$temp['alpha2code'] 	= $row['alpha2code'];
		$temp['alpha3code'] 	= $row['alpha3code'];
		$temp['name'] 			= ucwords($row['name_beta']);
		$temp['capital'] 		= ucwords($row['capital']);
		$temp['population'] 	= $row['population'];
		$temp['area'] 			= $row['area'];
		$temp['currencyCode'] 	= $row['currencyCode'];
		$temp['currencySymbol'] = $row['currencySymbol'];
		$temp['flag'] 			= $row['flag'];


		array_push($searchResult_a['rest_countries'], $temp);
	}
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($searchResult_a, JSON_UNESCAPED_UNICODE);

} else { echo json_encode("zero results", JSON_UNESCAPED_UNICODE); };

	mysqli_close($mysqli);

?>
