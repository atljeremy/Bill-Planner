<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

$chosenFormat = "";

$number_of_bills = isset($_GET['num']) ? intval($_GET['num']) : 20;
$format = strtolower($chosenFormat) == 'xml' ? 'xml' : 'json';

$output = array();

for($i = 1; $i <= $number_of_bills; $i++){
	$key = rand(111111111, 999999999);
	
	$name     = Array("name" => Array("Name:","John Doe"));
	$payto    = Array("payto" => Array("Pay To:","Jackson EMC"));
	$amount   = Array("amount" => Array("Amount:","157"));
  $account  = Array("account" => Array("From Account:","Wells Fargo - Checking"));
  $payon    = Array("payon" => Array("Pay On:","2012-05-15"));
  $notes    = Array("notes" => Array("Notes:","Electric bill"));
  $remember = Array("remember" => Array("Remember This Payment:","Yes"));
	
  $bill = $name + $payto + $amount + $account + $payon + $notes + $remember;

  $output[] = Array($key => $bill);
}

if($format == 'json') {
	header('Content-type: application/json');
	echo json_encode($output);
}
else {
	header('Content-type: text/xml');
	echo '<posts>';
	foreach($posts as $index => $post) {
		
		if(is_array($post)) {
			foreach($post as $key => $value) {
				echo '<',$key,'>';
				if(is_array($value)) {
					foreach($value as $tag => $val) {
						echo '<',$tag,'>',htmlentities($val),'</',$tag,'>';
					}
				}
				echo '</',$key,'>';
			}
		}
	}
	echo '</posts>';
}

?>