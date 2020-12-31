<?php
//called through use of CRON services. twice per day.
//include('./dbConnection.php');
include(dirname(__DIR__).'/php/dbConnection.php');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

//Load geoJson file
$contents       = file_get_contents('../resources/countries_small.geo.json');
//path required when site publish to hostinger
//$contents       = file_get_contents('/home/u540606035/domains/martindurrant.co.uk/public_html/projectPage/gazetteer/resources/countries_small.geo.json');

$decode         = json_decode($contents, true);
//$encode         = json_encode($decode, JSON_UNESCAPED_UNICODE);

//Iterate over file and rebuild JSON to include both alpha2, alpha3 codes (PRIMARY KEYS) and inject Covid Data
$obj = [];

foreach($decode['features'] as $entry){

    $temp['type'] = $entry['type'];
    //DB call to map in alpha2 code primary key (alpha3 code replaces that from covid api)
    $dataCall   = $entry['id'];
    $sql_a      = " SELECT alpha2code, alpha3code FROM restcountries WHERE alpha3code = '$dataCall' ";
    $result     = mysqli_query($mysqli, $sql_a);
    $temp['id'] = mysqli_fetch_assoc($result);
    //DB call to map in Covid Data
    $dataCall = $temp['id']['alpha2code'];
    $sql_a = "	SELECT * FROM covid_summary WHERE country_code = '$dataCall'";
    $result = mysqli_query($mysqli, $sql_a);
    $temp['covid'] = mysqli_fetch_assoc($result);
    // if(mysqli_num_rows($result) > 0) {
    //   $temp['covid'] = mysqli_fetch_assoc($result);
    // } 

    $temp['properties'] = $entry['properties'];
    $temp['geometry'] = $entry['geometry'];

    array_push($obj, $temp);
    }

$json = json_encode($obj, JSON_UNESCAPED_UNICODE);
echo $json;

//Creates file as .js, adds a variable names and the missing text to make is valid geoJson for leaflet.
file_put_contents('../resources/covidJson.js', 'const covidJson = {"type":"FeatureCollection","features":' . $json . '}');
//path required when site publish to hostinger
//file_put_contents('/home/u540606035/domains/martindurrant.co.uk/public_html/projectPage/gazetteer/resources/covidJson.js', 'const covidJson = {"type":"FeatureCollection","features":' . $json . '}');


mysqli_close($mysqli);

?>
