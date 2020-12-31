<?php
include(dirname(__DIR__).'/php/apikeys.php');	

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$alpha2code = $_POST['alpha2code'] === 'GB' ? 'UK' : $_POST['alpha2code'];
//$alpha2code = 'fr';

$url = 'https://www.triposo.com/api/20200803/location.json?countrycode='.$alpha2code.'&tag_labels=country&count=10&fields=id,name,score,snippet,properties&order_by=-score&account='.$triposoId.'&token=' . $triposoApiKey;
//top ten citys
//$url = 'https://www.triposo.com/api/20200803/location.json?countrycode='.$alpha2code.'&tag_labels=city&count=10&fields=id,coordinates,intro,properties&order_by=-score&account='.$id.'&token=' . $apiKey;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);
curl_close($ch);

$decode = json_decode($result, true);

$searchResult = [];
$searchResult['triposo_country'] = [];


foreach($decode['results'] as $entry){
    $temp =[];
    $temp['name'] = $entry['name'];
    $temp['snippet'] = $entry['snippet'];

    array_push($searchResult['triposo_country'], $temp);
};

// $sql = "INSERT INTO `restcountries` (`snippet`)
// VALUES ('{$temp['alpha2code']}')
// ON DUPLICATE KEY UPDATE 
//     `snippet` = VALUES(`snippet`)";

echo json_encode($searchResult, JSON_UNESCAPED_UNICODE);
//echo $result;

?>