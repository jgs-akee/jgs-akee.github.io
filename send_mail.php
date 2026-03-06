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
    
    // Honeypot check (must be empty)
    $honeypot = $_POST["website"] ?? '';
    
    // Math check
    $spam_check = $_POST["spam_check"] ?? '';
    $spam_answer = $_POST["spam_answer"] ?? '';

    if (!empty($honeypot)) {
        // Silent fail for bots
        http_response_code(200);
        echo "Nachricht erfolgreich gesendet.";
        exit;
    }

    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Bitte füllen Sie alle erforderlichen Felder aus.";
        exit;
    }
    
    // Simple verification for the manual spam check
    // We expect the sum to match what we send in the hidden field or just a fixed check
    if ($spam_check !== $spam_answer) {
        http_response_code(400);
        echo "Die Sicherheitsabfrage wurde falsch beantwortet.";
        exit;
    }

    $subject = "⚡ Neue Projektanfrage: $name";
    
    // HTML Email Template
    $email_content = "
    <html>
    <head>
        <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
            .header { background: #0a0a0a; color: #F5A800; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .field { margin-bottom: 15px; border-bottom: 1px solid #f9f9f9; padding-bottom: 8px; }
            .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; display: block; }
            .value { font-size: 16px; color: #111; display: block; margin-top: 4px; }
            .footer { background: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>JGS Akee</h1>
                <p>Neue Online-Anfrage</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>Name:</span>
                    <span class='value'>$name</span>
                </div>
                <div class='field'>
                    <span class='label'>E-Mail:</span>
                    <span class='value'>$email</span>
                </div>
                <div class='field'>
                    <span class='label'>Telefon:</span>
                    <span class='value'>$phone</span>
                </div>
                <div class='field' style='border: none;'>
                    <span class='label'>Nachricht:</span>
                    <div style='background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;'>
                        " . nl2br($message) . "
                    </div>
                </div>
            </div>
            <div class='footer'>
                Diese E-Mail wurde über das Kontaktformular auf jgs-akee.de gesendet.
            </div>
        </div>
    </body>
    </html>";

    // Setze Content-Type für HTML-E-Mails
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    
    // Definiere den Absender klarer
    $from_name = "JGS Akee Webpage";
    $from_email = $_ENV['SMTP_FROM'] ?: 'contact-form@jgs-akee.de';
    $headers .= "From: $from_name <$from_email>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";

    if (mail('info@jgs-akee.de', $subject, $email_content, $headers, "-f $from_email")) {
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
