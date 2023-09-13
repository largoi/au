<?
$ip2 = $_SERVER['HTTP_CLIENT_IP'] ? $_SERVER['HTTP_CLIENT_IP'] : ($_SERVER['HTTP_X_FORWARDED_FOR'] ? $_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR']);
$today = getdate();
$date = ''.$today['weekday'].' - '.$today['mday'].' '.$today['month'].' '.$today['year'].' - '.$today['hours'].':'.$today['minutes'].':'.$today['seconds'].'';


$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'http://api.ipinfodb.com/v3/ip-country/?key=6f87bf185e98e5906164c0e48167dd20e5dd24c485c14b2ff9a873394185353a&ip='.$ip2.'');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close($ch);
$str_arr = explode (";", $result); 
#print_r();



$AuthCountry = array('ma', 'au'); 

$CountryData = $str_arr[3];
if(!in_array(strtolower($CountryData),$AuthCountry)){
$file = fopen("banned.txt","a");
fwrite($file, $date." : ".$_SERVER['REMOTE_ADDR']." - ".gethostbyaddr($_SERVER['REMOTE_ADDR'])."\n");
fclose($file);
header("HTTP/1.0 404 Not Found");exit();
}
?>