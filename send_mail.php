<?php
/**
 * JGS Akee Mail Sender
 * Nutzt die Zugangsdaten aus der .env Datei
 */

// Lade .env Variablen (einfache Implementation für PHP)
function loadEnv($path) {
    if(!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

loadEnv(__DIR__ . '/.env');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"]));
    $message = strip_tags(trim($_POST["message"]));

    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Bitte füllen Sie alle Felder korrekt aus.";
        exit;
    }

    $subject = "Neue Anfrage von $name (JGS Akee)";
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Telefon: $phone\n\n";
    $email_content .= "Nachricht:\n$message\n";

    $headers = "From: " . $_ENV['SMTP_FROM'] . "\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Hinweis: Für echten SMTP-Versand via Ionos (Port 465/SSL) 
    // sollte idealerweise PHPMailer verwendet werden. 
    // Hier nutzen wir mail() als Fallback, falls der Server konfiguriert ist.
    if (mail($_ENV['SMTP_TO'], $subject, $email_content, $headers)) {
        http_response_code(200);
        echo "Nachricht erfolgreich gesendet.";
    } else {
        http_response_code(500);
        echo "Fehler beim Senden der Nachricht.";
    }
} else {
    http_response_code(403);
    echo "Es gab ein Problem mit Ihrer Anfrage.";
}
?>
