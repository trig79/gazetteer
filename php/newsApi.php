<?php
	include(dirname(__DIR__).'/php/apikeys.php');	

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$url = 'https://newsapi.org/v2/top-headlines?country=' . $_POST['alpha2code'] . '&apiKey=' . $newsApiKey;
    
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
	curl_close($ch);

	$decode = [];
	$decode['current_news'] = json_decode($result,true);

	//echo $result
	echo json_encode($decode, JSON_UNESCAPED_UNICODE)
?>