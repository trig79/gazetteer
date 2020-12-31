<?php
//created for CRON services
//include('./dbConnection.php');
include(dirname(__DIR__).'/php/dbConnection.php');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

	
$url = "https://api.covid19api.com/summary";

$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);
curl_close($ch);

//$json_cache = $result;
//file_put_contents($cache, $json_cache);

$decode = json_decode($result,true);
	
for ($i = 0; $i < count($decode['Countries']); $i++) {  

	$temp['country'] 			= $decode['Countries'][$i]['Country']; 
	$temp['countryCode'] 		= $decode['Countries'][$i]['CountryCode']; 
	$temp['slug'] 				= $decode['Countries'][$i]['Slug']; 
	$temp['newConfirmed'] 		= $decode['Countries'][$i]['NewConfirmed']; 
	$temp['totalConfirmed'] 	= $decode['Countries'][$i]['TotalConfirmed']; 
	$temp['newDeaths'] 			= $decode['Countries'][$i]['NewDeaths']; 
	$temp['totalDeaths'] 		= $decode['Countries'][$i]['TotalDeaths']; 
	$temp['newRecovered'] 		= $decode['Countries'][$i]['NewRecovered']; 
	$temp['totalRecovered'] 	= $decode['Countries'][$i]['TotalRecovered']; 

	//array_push($cleanObj['results'], $temp);
	
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


mysqli_close($mysqli);

?>
