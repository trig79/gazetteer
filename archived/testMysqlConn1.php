<?php

$dbname = 'gazetteer';
$dbuser = 'martin';
$dbpass = 'martin';
$dbhost = 'localhost:3309';

$mysqli = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
//$link = mysqli_connect($dbhost, $dbuser, $dbpass) or die("Unable to Connect to '$dbhost'");
//mysqli_select_db($link, $dbname) or die("Could not open the db '$dbname'");

$sql = "INSERT INTO `test2` (`firstname`, `surname`) VALUES ('martin2', 'martin2')";
mysqli_query($mysqli, $sql);

if (!$mysqli) {
  echo "Error: Unable to connect to MySQL." . PHP_EOL;
  echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
  echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
  exit;
}

echo "WAMP FOLDERS!! Success: A proper connection to MySQL was made! The $dbname database is great." . PHP_EOL;
echo "Host information: " . mysqli_get_host_info($mysqli) . PHP_EOL;


$test_query = "SHOW TABLES FROM $dbname";
$result = mysqli_query($mysqli, $test_query);

$tblCnt = 0;
while($tbl = mysqli_fetch_array($result)) {
  $tblCnt++;
  #echo $tbl[0]."<br />\n";
}

if (!$tblCnt) {
  echo "There are no tables<br />\n";
} else {
  echo "There are $tblCnt tables<br />\n";
} 


mysqli_close($mysqli);
?>