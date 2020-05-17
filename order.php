<?php
header("Access-Control-Allow-Origin: *");
header("Content-type: application/json; charset=utf-8");

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (empty($data)) {
  echo json_encode([
    "success" => false,
    "message" => "Не отправлены данные",
    "input" => $input,
  ]);

  die();
}

function sendEmail($address, $fromName, $fromAdderss, $subject, $message) {
  $fromBase64 = "=?utf-8?B?".base64_encode($fromName)."?=";
  $subjectBase64 = "=?utf-8?B?".base64_encode($subject)."?=";

  $headers = "MIME-Version: 1.0\r\n";
  $headers .= "Content-type: text/html; charset=utf-8\r\n";
  $headers .= "From: $fromBase64 <$fromAdderss>\r\n";

  return mail($address, $subjectBase64, $message, $headers, "-f $fromAdderss");
}

$name = $data["name"];
$phone = $data["phone"];
$email = $data["email"];
$comment = $data["comment"];

$messageSent = false;

// Создаем письмо
$message = <<<EOT
<p>Имя: <strong>$name</strong></p>
<p>Телефон: <strong>$phone</strong></p>
<p>Почта: <strong><a href="mailto:$email">$email</a></strong></p>
<p>Сообщение: <strong>$comment</strong></p>
EOT;

$address = 'aroma-group@list.ru';
// $address = 'dubaua@gmail.com';
$fromName = 'Aroma Group';
$fromAdderss = 'noreply@aroma-group.su';
$subject = 'Письмо с сайта Aroma Group';

$messageSent = sendEmail($address, $fromName, $fromAdderss, $subject, $message);

echo json_encode(array(
  "success" => $messageSent,
));
