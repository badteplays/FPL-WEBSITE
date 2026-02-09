document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initCounters();
    initNavScroll();
});

function initScrollReveal() {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
    });
}

function initCounters() {
    var statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;

    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counterObserver.observe(statsBar);
}

function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'));
    if (!target) return;
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(step);
}

function initNavScroll() {
    window.addEventListener('scroll', function () {
        var nav = document.getElementById('navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });
}

function switchTab(tab, btn) {
    var grid = document.getElementById('pricingGrid');
    var allBtns = document.querySelectorAll('.tab-btn');
    allBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    grid.classList.add('fade-out');

    setTimeout(function () {
        var cards = grid.querySelectorAll('.pricing-card');
        cards.forEach(function (card) {
            if (card.getAttribute('data-category') === tab) {
                card.style.display = 'flex';
                card.classList.remove('active');
                void card.offsetWidth;
            } else {
                card.style.display = 'none';
            }
        });

        grid.classList.remove('fade-out');

        setTimeout(function () {
            var visible = grid.querySelectorAll('.pricing-card[data-category="' + tab + '"]');
            visible.forEach(function (card) {
                card.classList.add('active');
            });
        }, 50);
    }, 350);
}

function toggleMobileMenu() {
    var nav = document.getElementById('navbar');
    nav.classList.toggle('mobile-open');
}

function openModal(packageName, price) {
    var overlay = document.getElementById('modalOverlay');
    document.getElementById('modalPackage').textContent = packageName;
    document.getElementById('modalPrice').textContent = '$' + price;
    document.getElementById('orderForm').reset();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    var overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function closeModalOutside(event) {
    if (event.target === document.getElementById('modalOverlay')) {
        closeModal();
    }
}

function submitOrder(event) {
    event.preventDefault();
    var name = document.getElementById('formName').value;
    var email = document.getElementById('formEmail').value;
    var phone = document.getElementById('formPhone').value;
    var company = document.getElementById('formCompany').value;
    var message = document.getElementById('formMessage').value;
    var pkg = document.getElementById('modalPackage').textContent;
    var price = document.getElementById('modalPrice').textContent;

    var subject = encodeURIComponent('Inquiry: ' + pkg + ' - ' + price);
    var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Company: ' + company + '\n' +
        'Package: ' + pkg + ' (' + price + ')\n\n' +
        'Message:\n' + message
    );

    window.location.href = 'mailto:contact@arcatechbp.com?subject=' + subject + '&body=' + body;
    closeModal();
}

function submitContact(event) {
    event.preventDefault();
    var name = document.getElementById('contactName').value;
    var email = document.getElementById('contactEmail').value;
    var phone = document.getElementById('contactPhone').value;
    var subjectVal = document.getElementById('contactSubject').value || 'General Inquiry';
    var message = document.getElementById('contactMessage').value;

    var subject = encodeURIComponent(subjectVal);
    var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n\n' +
        'Message:\n' + message
    );

    window.location.href = 'mailto:contact@arcatechbp.com?subject=' + subject + '&body=' + body;
    document.getElementById('contactForm').reset();
}

document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
        var nav = document.getElementById('navbar');
        nav.classList.remove('mobile-open');
    });
});
