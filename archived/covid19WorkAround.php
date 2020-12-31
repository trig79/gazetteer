<?php
//DB connection
$dbname = 'gazetteer';
$dbuser = 'martin';
$dbpass = 'martin';
$dbhost = 'localhost:3309';

$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
//$link = mysqli_connect($dbhost, $dbuser, $dbpass) or die("Unable to Connect to '$dbhost'");
//mysqli_select_db($link, $dbname) or die("Could not open the db '$dbname'");

if (!$mysqli) {
  echo "Error: Unable to connect to MySQL." . PHP_EOL;
  echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
  echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
  exit;
}

if (!$mysqli) {
	echo "Error: Unable to connect to MySQL." . PHP_EOL;
	echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
	echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
	exit;
  }
  
//echo "WAMP FOLDERS!!!! Success: A proper connection to MySQL was made! The my_db database is great." . PHP_EOL;
//echo "Host information: " . mysqli_get_host_info($mysqli) . PHP_EOL;

ini_set('display_errors', 'On');
error_reporting(E_ALL);

//time update tracker.
$dateDbModified = "covidDbModified.txt";
if(!touch($dateDbModified)) {echo ("$dateDbModified has not been update");};

//I recieve the data from the Ajax call and store to local file
$obj_recieved  = $_POST['covidData'];
$cache	   = __DIR__."/covid19WorkAround.json"; 

$force_refresh	= false; // dev
$refresh		= 60*60*24; // once a day

if ($force_refresh || ((time() - filemtime($cache)) > ($refresh) || 0 == filesize($cache))) {

	$encode 	   = json_encode($obj_recieved, JSON_UNESCAPED_UNICODE);
	file_put_contents($cache, $encode);

	for ($i = 0; $i < count($obj_recieved['Countries']); $i++) {  

		$temp['country'] 			= $obj_recieved['Countries'][$i]['Country']; 
		$temp['countryCode'] 		= $obj_recieved['Countries'][$i]['CountryCode']; 
		$temp['slug'] 				= $obj_recieved['Countries'][$i]['Slug']; 
		$temp['newConfirmed'] 		= $obj_recieved['Countries'][$i]['NewConfirmed']; 
		$temp['totalConfirmed'] 	= $obj_recieved['Countries'][$i]['TotalConfirmed']; 
		$temp['newDeaths'] 			= $obj_recieved['Countries'][$i]['NewDeaths']; 
		$temp['totalDeaths'] 		= $obj_recieved['Countries'][$i]['TotalDeaths']; 
		$temp['newRecovered'] 		= $obj_recieved['Countries'][$i]['NewRecovered']; 
		$temp['totalRecovered'] 	= $obj_recieved['Countries'][$i]['TotalRecovered']; 

		array_push($cleanObj['results'], $temp);
		
		$sql = "INSERT INTO `covid_summary` (`country`, `country_code`, `slug`, `new_confirmed`, `total_confirmed`, `new_deaths`, `total_deaths`, `new_recovered`, `total_recovered`)
				VALUES ('{$temp['country']}',
						'{$temp['countryCode']}',
						'{$temp['slug']}',
						'{$temp['newConfirmed']}',
						'{$temp['totalConfirmed']}',
						'{$temp['newDeaths']}',
						'{$temp['totalDeaths']}',
						'{$temp['newRecovered']}',
						'{$temp['totalRecovered']}')
				ON DUPLICATE KEY UPDATE 
					`country` 		= VALUES(`country`),
					`country_code`	= VALUES(`country_code`),
					`slug`			= VALUES(`slug`),
					`new_confirmed`	= VALUES(`new_confirmed`),
					`total_confirmed`=VALUES(`total_confirmed`),
					`new_deaths`	= VALUES(`new_deaths`),
					`total_deaths`	= VALUES(`total_deaths`),
					`new_recovered` = VALUES(`new_recovered`),
					`total_recovered`=VALUES(`total_recovered`)";
					
		mysqli_query($mysqli, $sql); 						
	};
	// header('Content-Type: application/json; charset=UTF-8');
	// echo json_encode($cleanObj, JSON_UNESCAPED_UNICODE);
} 

$cleanObj = [];
$cleanObj['results'] = [];

//DB Fetch Data
$sql_a = "	SELECT * FROM covid_summary	WHERE country_code = '{$countryCodeReq}'";


//$sql_a = "	SELECT * FROM restcountries	WHERE name = '{$countryReq}'";
$result_a = mysqli_query($mysqli, $sql_a); 						

if (mysqli_num_rows($result_a) > 0) {

	$searchResult_a = [];
	$searchResult_a['results'] = [];

	while($row = mysqli_fetch_assoc($result_a)) {
		$temp = [];

		//foreach ($test as $entry) {

		$temp['source'] 		= 'restCountries';
		$temp['alpha2code'] 	= $row['alpha2code'];
		$temp['alpha3code'] 	= $row['alpha3code'];
		$temp['name'] 			= ucwords($row['name']);
		$temp['capital'] 		= ucwords($row['capital']);
		$temp['population'] 	= $row['population'];
		$temp['area'] 			= $row['area'];
		$temp['currencyCode'] 	= $row['currencyCode'];
		$temp['currencySymbol'] = $row['currencySymbol'];
		$temp['flag'] 			= $row['flag'];


		array_push($searchResult_a['results'], $temp);
		//echo $row['alpha2Code'];
		//}
	}
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($searchResult_a, JSON_UNESCAPED_UNICODE);

} else { echo "zero results"; };


	
	for ($i = 0; $i < count($obj_recieved['Countries']); $i++) {  

		$temp['country'] 			= $obj_recieved['Countries'][$i]['Country']; 
		$temp['countryCode'] 		= $obj_recieved['Countries'][$i]['CountryCode']; 
		$temp['slug'] 				= $obj_recieved['Countries'][$i]['Slug']; 
		$temp['newConfirmed'] 		= $obj_recieved['Countries'][$i]['NewConfirmed']; 
		$temp['totalConfirmed'] 	= $obj_recieved['Countries'][$i]['TotalConfirmed']; 
		$temp['newDeaths'] 			= $obj_recieved['Countries'][$i]['NewDeaths']; 
		$temp['totalDeaths'] 		= $obj_recieved['Countries'][$i]['TotalDeaths']; 
		$temp['newRecovered'] 		= $obj_recieved['Countries'][$i]['NewRecovered']; 
		$temp['totalRecovered'] 	= $obj_recieved['Countries'][$i]['TotalRecovered']; 

		array_push($cleanObj['results'], $temp);
	};

	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($cleanObj, JSON_UNESCAPED_UNICODE);

	

mysqli_close($mysqli);

//THIS DOESN'T
// $cleanObj = [];
// $cleanObj['results'] = [];
// $temp = [];
// $i = 1;
// 	foreach ($obj_recieved['Countries'] as $entry) {
		
// 		$temp['country'] = $$entry[$i]['Country'];
// 		$temp['countrycode'] = $entry[$i]['CountryCode'];
// 		array_push($cleanObj['results'], $temp);
// 		$i++;
// 	}

?>
