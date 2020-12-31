<?php
//DB connection localhost
$dbname = 'gazetteer';
$dbuser = 'martin';
$dbpass = 'martin';
$dbhost = 'localhost:3309';
//DB connection hostinger
// $dbname = 'u540606035_gazetteer';
// $dbuser = 'u540606035_martin';
// $dbpass = 'Arsenal1!';
// $dbhost = 'localhost';

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


?>