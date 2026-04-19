<?php
// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Nepovolená metoda.']));
}

header('Content-Type: application/json; charset=utf-8');

// --- Collect & sanitize input ---
$name    = trim(strip_tags($_POST['name']    ?? ''));
$phone   = trim(strip_tags($_POST['phone']   ?? ''));
$email   = trim(strip_tags($_POST['email']   ?? ''));
$extra   = trim(strip_tags($_POST['extra']   ?? ''));
$vehicle = trim(strip_tags($_POST['vehicle'] ?? ''));
$consent = isset($_POST['consent']) ? true : false;

// Services are sent as an array (name="service[]")
$services = [];
if (!empty($_POST['service'])) {
    $rawServices = is_array($_POST['service']) ? $_POST['service'] : [$_POST['service']];
    foreach ($rawServices as $s) {
        $services[] = strip_tags(trim($s));
    }
}

// --- Basic validation ---
if (empty($name) || empty($phone) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Vyplňte prosím jméno, telefon a e-mail.']);
    exit;
}

// Name: only letters (including diacritics), spaces, hyphens, dots, 2-100 chars
if (!preg_match('/^[\p{L}][\p{L}\s\-\.]{1,99}$/u', $name)) {
    echo json_encode(['success' => false, 'message' => 'Jméno smí obsahovat pouze písmena, mezery a pomlčky.']);
    exit;
}

// Phone: +, digits, spaces, hyphens, parentheses; at least 9 digits
if (!preg_match('/^\+?[\d\s\-\(\)]{9,20}$/', $phone) || strlen(preg_replace('/\D/', '', $phone)) < 9) {
    echo json_encode(['success' => false, 'message' => 'Zadejte platné telefonní číslo (min. 9 číslic).']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Zadejte platnou e-mailovou adresu.']);
    exit;
}

if (!$consent) {
    echo json_encode(['success' => false, 'message' => 'Musíte souhlasit se zpracováním osobních údajů.']);
    exit;
}

// --- Vehicle label map ---
$vehicleLabels = [
    'hatchback' => 'Hatchback',
    'sedan'     => 'Sedan',
    'suv'       => 'SUV',
    'van'       => 'Van / MPV',
    'moto'      => 'Moto',
];

// --- Service label map ---
$serviceLabels = [
    'rucni-myti'       => 'Ruční mytí vozu',
    'cisteni-interieru'=> 'Čištění interiéru',
    'polepy'           => 'Polepy aut',
    'ppf'              => 'Ochranné fólie (PPF)',
    'renovace-laku'    => 'Renovace laku',
    'keramika'         => 'Keramická ochrana laku',
    'kuze'             => 'Opravy kůže (sedačky, interiér)',
];

$vehicleText   = $vehicle ? ($vehicleLabels[$vehicle] ?? $vehicle) : '— nevybráno —';
$servicesText  = !empty($services)
    ? implode("\n    ", array_map(fn($s) => '• ' . ($serviceLabels[$s] ?? $s), $services))
    : '— žádná —';

// --- Build e-mail ---
$to      = 'info@wrapwash.cz';
$subject = '=?UTF-8?B?' . base64_encode('Nová rezervace – Wash & Wrap') . '?=';

$body  = "Nová poptávka z rezervačního formuláře na washwrap.cz\n";
$body .= str_repeat('=', 55) . "\n\n";
$body .= "Jméno:    {$name}\n";
$body .= "Telefon:  {$phone}\n";
$body .= "E-mail:   {$email}\n\n";
$body .= "Typ vozu:\n    {$vehicleText}\n\n";
$body .= "Požadované služby:\n    {$servicesText}\n\n";
$body .= "Extra požadavky:\n" . ($extra ?: '—') . "\n";
$body .= str_repeat('=', 55) . "\n";
$body .= "Zpráva odeslána automaticky z webu washwrap.cz";

$headers  = "From: web@washwrap.cz\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Děkujeme! Vaši poptávku jsme přijali a brzy se vám ozveme.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Nepodařilo se odeslat zprávu. Zkuste to prosím znovu nebo nás kontaktujte telefonicky.']);
}
