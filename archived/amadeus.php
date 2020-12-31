<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$apiKey = 'syuHfHs4jrZ3c7gWvtWDAPWrdkRXsMlT';
$secretKey = 'YRpB2SyuhiGJw2Gk';

$url = 'https://test.api.amadeus.com/v1/security/oauth2/token';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials&client_id='.$apiKey.'&client_secret='.$secretKey);

$result=curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);
$token = $decode['access_token'];

//echo $token;

$urlfetch = 'https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=41.397158&longitude=2.160873&radius=2';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);
//curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials&client_id='.$apiKey.'&client_secret='.$secretKey);

$result=curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);
$token = $decode['access_token'];

echo json_encode($result, JSON_UNESCAPED_UNICODE);



?>