<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$url = "https://api.exchangerate.host/latest?base=" . $_POST['alpha3code'];

// Open CURL session:
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

// Get the data:
$result = curl_exec($ch);
curl_close($ch);

// Decode JSON response:
$decode = [];
$decode['exchange_rate_api'] = json_decode($result, true);


//echo $result
echo json_encode($decode, JSON_UNESCAPED_UNICODE)
?>
