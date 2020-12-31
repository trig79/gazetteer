<?php
//created pre cron job
//include('./dbConnection.php');
include(dirname(__DIR__).'/php/dbConnection.php');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

//time update tracker.
$dateDbModified = "./covid19DbModified.txt";
if(!touch($dateDbModified)) {echo ("$dateDbModified has not been update");};

//$cache 			= "../cache/covid19.json"; 
$force_refresh	= false; // dev
$refresh		= 60*60*24; // once a day 

//DB Refresh
if ($force_refresh || ((time() - filectime($dateDbModified)) > ($refresh))) { 
	
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
}

//DB Fetch Data
$countryCodeReq = $_REQUEST['countryCode'];
$sql_a = "	SELECT * FROM covid_summary	WHERE country_code = '$countryCodeReq'";
$result_a = mysqli_query($mysqli, $sql_a); 						

if (mysqli_num_rows($result_a) > 0){
	$arr = [];
		while($row = mysqli_fetch_assoc($result_a)) {
			$arr['covid_19'] = $row;
		};
	$encode = json_encode($arr, JSON_UNESCAPED_UNICODE);
	echo $encode;
} else {
	$temp_a['covid_19']['country'] 			= 0; 
	$temp_a['covid_19']['country_code'] 		= 0;
	$temp_a['covid_19']['slug'] 				= 0;
	$temp_a['covid_19']['new_confirmed'] 		= 0;
	$temp_a['covid_19']['total_confirmed'] 	= 0;
	$temp_a['covid_19']['new_deaths'] 			= 0;
	$temp_a['covid_19']['total_deaths'] 		= 0;
	$temp_a['covid_19']['new_recovered'] 		= 0;
	$temp_a['covid_19']['total_recovered'] 	= 0;

	$encode_a = json_encode($temp_a, JSON_UNESCAPED_UNICODE);
	echo $encode_a;

}

mysqli_close($mysqli);

?>
