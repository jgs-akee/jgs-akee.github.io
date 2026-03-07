/**
 * JGS Akee Main Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initNavbarScroll();
    initContactForm();
    initSpamCheck();
    initCounterAnimation();
});

/**
 * Animate numbers counting up
 */
function initCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.getAttribute('data-value');
                const suffix = target.getAttribute('data-suffix') || '';

                if (finalValue && !target.classList.contains('animated')) {
                    animateNumber(target, parseInt(finalValue), suffix);
                    target.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        // Prepare data attributes from text content if not already set
        if (!stat.getAttribute('data-value')) {
            const text = stat.textContent.trim();
            const match = text.match(/(\d+)(.*)/);
            if (match) {
                stat.setAttribute('data-value', match[1]);
                stat.setAttribute('data-suffix', match[2]);
                stat.textContent = '0' + match[2]; // Start at 0
            }
        }
        observer.observe(stat);
    });
}

/**
 * Helper to animate a single number
 */
function animateNumber(element, finalValue, suffix) {
    let startTimestamp = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Easing function: outQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(easeProgress * finalValue);

        element.textContent = currentValue + suffix;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = finalValue + suffix;
        }
    };

    window.requestAnimationFrame(step);
}


/**
 * Reveal elements on scroll
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Staggered delay for multiple elements intersecting at once
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
            }
        });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));
}

/**
 * Navbar shadow effect on scroll
 */
function initNavbarScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            nav.style.boxShadow = '0 4px 30px rgba(0,0,0,.08)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        const formData = new FormData(form);

        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet...';

        try {
            const response = await fetch('send_mail.php', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                status.style.display = 'block';
                status.style.color = '#4CAF50';
                status.textContent = '✓ Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.';
                submitBtn.textContent = '✓ Gesendet';
                form.reset();
                if (typeof initSpamCheck === 'function') initSpamCheck();
            } else {
                // Hier fangen wir HTTP-Fehler wie 404 (nicht gefunden) oder 500 (Serverfehler) ab
                if (response.status === 404) {
                    throw new Error('Die Datei "send_mail.php" wurde auf dem Server nicht gefunden.');
                }
                if (response.status === 405 || response.status === 403) {
                    throw new Error('Der Server erlaubt keinen PHP-Versand (wahrscheinlich GitHub Pages).');
                }
                const errorText = await response.text();
                throw new Error(errorText || `Server-Fehler: ${response.status}`);
            }
        } catch (error) {
            status.style.display = 'block';
            status.style.color = '#FF5252';
            // "Load failed" durch eine verständlichere Meldung ersetzen, wenn es ein Netzwerkfehler ist
            let msg = error.message;
            if (msg === 'Load failed' || msg === 'Failed to fetch') {
                msg = 'Verbindung fehlgeschlagen. (Hinweis: PHP funktioniert nicht lokal über file:// oder auf GitHub Pages!)';
            }
            status.textContent = '❌ ' + msg;
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            console.error('Form Error:', error);
        }
    });
}

/**
 * Anti-Spam Math Challenge
 */
function initSpamCheck() {
    const labels = document.querySelectorAll('.spam_label, #spam_label');
    const hiddenAnswers = document.querySelectorAll('.spam_answer_hidden, #spam_answer');

    if (labels.length === 0) return;

    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;

    labels.forEach(label => {
        label.textContent = `Sicherheitsabfrage: Was ergibt ${num1} + ${num2}?`;
    });

    hiddenAnswers.forEach(hidden => {
        hidden.value = answer;
    });
}
