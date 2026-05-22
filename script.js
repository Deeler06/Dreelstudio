/* ═══════════════════════════════════════════════
   SCRIPT.JS — Dreel Studio
   • Dark / Light theme toggle (persisted)
   • Mobile nav menu
   • Scroll reveal animations
   • Active nav link highlight
   • Contact form handler
   • Header scroll shadow
═══════════════════════════════════════════════ */

/* ─── THEME TOGGLE ─── */
(function () {
    const html       = document.documentElement;
    const toggleBtn  = document.getElementById('themeToggle');
    const themeIcon  = document.getElementById('themeIcon');
    const STORAGE_KEY = 'dreel-theme';

    // Load saved theme (default: light)
    const saved = localStorage.getItem(STORAGE_KEY) || 'light';
    applyTheme(saved);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next    = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem(STORAGE_KEY, next);
        });
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark'
                ? 'fa-solid fa-sun'
                : 'fa-solid fa-moon';
        }
    }
})();


/* ─── MOBILE NAV ─── */
(function () {
    const menuBtn = document.getElementById('menuBtn');
    const nav     = document.getElementById('main-nav');

    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('active');

        // swap icon
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.className = nav.classList.contains('active')
                ? 'fa-solid fa-xmark'
                : 'fa-solid fa-bars';
        }
    });

    // Close when a nav link is clicked
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
            nav.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
        }
    });
})();


/* ─── HEADER SCROLL SHADOW ─── */
(function () {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
})();


/* ─── SCROLL REVEAL ─── */
(function () {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // stagger siblings for a nicer cascade
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, Number(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    reveals.forEach((el, i) => {
        // auto-assign stagger delay to siblings within same parent
        el.dataset.delay = (i % 3) * 100;
        observer.observe(el);
    });
})();


/* ─── ACTIVE NAV LINK ─── */
(function () {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === page);
    });
})();


/* ─── CONTACT FORM ─── */
function handleFormSubmit() {
    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');
    const btn     = document.getElementById('submitBtn');
    const success = document.getElementById('formSuccess');

    // Simple validation
    if (!name || !name.value.trim()) return shake(name);
    if (!email || !isValidEmail(email.value)) return shake(email);
    if (!message || !message.value.trim()) return shake(message);

    // Simulate sending (replace with real backend / Formspree / EmailJS)
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
    }

    setTimeout(() => {
        if (btn) {
            btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
            btn.disabled = false;
        }
        if (success) success.classList.add('show');
        if (name)    name.value    = '';
        if (email)   email.value   = '';
        if (message) message.value = '';

        const svc = document.getElementById('service');
        if (svc) svc.value = '';

        // Hide success after 5s
        setTimeout(() => {
            if (success) success.classList.remove('show');
        }, 5000);
    }, 1400);
}

function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function shake(el) {
    if (!el) return;
    el.style.borderColor = 'var(--red)';
    el.style.animation   = 'shake 0.4s ease';
    el.addEventListener('animationend', () => {
        el.style.animation = '';
    }, { once: true });
}

/* Shake keyframes injected via JS so we don't need extra CSS */
(function injectShake() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%,100%{transform:translateX(0)}
            20%{transform:translateX(-6px)}
            40%{transform:translateX(6px)}
            60%{transform:translateX(-4px)}
            80%{transform:translateX(4px)}
        }
    `;
    document.head.appendChild(style);
})();
