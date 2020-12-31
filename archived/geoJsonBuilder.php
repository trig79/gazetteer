<?php
//Takes small countries GeoJson file and combines with another data source (currently set to covid). Outputs a new json that can be used in leaflet layers
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

//Load the file
$contents       = file_get_contents('../resources/countries_small.geo.json');
$decode         = json_decode($contents, true);
$encode         = json_encode($decode, JSON_UNESCAPED_UNICODE);

$sql_a = "	SELECT alpha2code, alpha3code FROM restcountries;";
$result_a = mysqli_query($mysqli, $sql_a);


$obj = [];

foreach($decode['features'] as $entry){

    $temp['type'] = $entry['type'];
    //DB call to map in alpha2code primary key
    $dataCall = $entry['id'];
    $sql_a = "	SELECT alpha2code, alpha3code FROM restcountries WHERE alpha3code = '$dataCall'";
    $result = mysqli_query($mysqli, $sql_a);
    $temp['id'] = mysqli_fetch_assoc($result);

    $aaa = $temp['id']['alpha2code'];
    $sql_b = "	SELECT * FROM covid_summary WHERE country_code = '$aaa'";
    $result_b = mysqli_query($mysqli, $sql_b);
    $temp['covid'] = mysqli_fetch_assoc($result_b);





    $temp['properties'] = $entry['properties'];
    $temp['geometry'] = $entry['geometry'];

    array_push($obj, $temp);
    }

$json = json_encode($obj, JSON_UNESCAPED_UNICODE);
echo $json;
//output contents in to js file to allow immediate use in program, appends varible name and extra text to comply with geoJson format.
file_put_contents('../resources/covidJson.js', 'const smallGeoJsonB = {"type":"FeatureCollection","features":' . $json . '}');


mysqli_close($mysqli);

?>
