/**
 * JGS Akee Main Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initNavbarScroll();
    initContactForm();
});

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
            } else {
                throw new Error('Server respond mit Fehler');
            }
        } catch (error) {
            status.style.display = 'block';
            status.style.color = '#FF5252';
            status.textContent = '❌ Fehler: Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.';
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}
