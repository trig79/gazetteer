<?php
//include('./dbConnection.php');
include(dirname(__DIR__).'/php/dbConnection.php');

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$errorMessage = $_POST['errorMessage'];
//$errorMessage = 'Open Cage Error 200 : OK. Error was generated calling latLonSearch at lat: 19.92757896499717 lat: -9.708072127053422';
// $sql = "CREATE TABLE IF NOT EXISTS `error_logs` (
// 		`id` 			int 		NOT NULL UNIQUE AUTO_INCREMENT,
// 		`date_created` 	timestamp 	DEFAULT CURRENT_TIMESTAMP,
// 		`error`			blob,
// 		PRIMARY KEY (id)
// 	)";

$sql = "INSERT INTO `error_logs` (`error`) VALUES ('{$errorMessage}')" ;


mysqli_query($mysqli, $sql);						

mysqli_close($mysqli);

echo ('Error Logged in Database')

?>