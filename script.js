document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initCounters();
    initNavScroll();
    
    // Check for hash on load
    if (window.location.hash) {
        const page = window.location.hash.substring(1);
        const validPages = ['home', 'services', 'why-us', 'contact'];
        if (validPages.includes(page)) {
            switchPage(page);
        }
    }
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
    var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.page').forEach(page => {
        counterObserver.observe(page);
    });
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

function switchPage(pageId, btn) {
    const pages = document.querySelectorAll('.page');
    const links = document.querySelectorAll('.nav-links a');
    
    // Find link if not provided
    if (!btn) {
        links.forEach(l => {
            const onclick = l.getAttribute('onclick');
            if (onclick && (onclick.includes(`'${pageId}'`) || onclick.includes(`"${pageId}"`))) {
                btn = l;
            }
        });
    }

    // Deactivate all
    pages.forEach(p => p.classList.remove('active'));
    links.forEach(l => l.classList.remove('active'));

    // Activate target
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        if (btn) btn.classList.add('active');
        
        // Update URL hash without jumping
        history.pushState(null, null, '#' + pageId);
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Re-trigger scroll reveal for new visible elements
        setTimeout(() => {
            targetPage.querySelectorAll('.reveal').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('active');
                }
            });
            
            // Re-init counters if switching to home
            if (pageId === 'home') {
                targetPage.querySelectorAll('.stat-number').forEach(animateCounter);
            }
        }, 100);
    }
    
    // Close mobile menu
    var nav = document.getElementById('navbar');
    // For Tailwind we can just assume if we had a mobile open class it would be here
    nav.classList.remove('mobile-open');
}

function switchTab(tab, btn) {
    var grid = document.getElementById('pricingGrid');
    var allBtns = document.querySelectorAll('.tab-btn');
    allBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    grid.style.opacity = '0';
    grid.style.transform = 'translateY(12px)';

    setTimeout(function () {
        var cards = grid.querySelectorAll('.pricing-card');
        cards.forEach(function (card) {
            if (card.getAttribute('data-category') === tab) {
                card.classList.remove('hidden');
                card.style.opacity = '0';
                void card.offsetWidth;
            } else {
                card.classList.add('hidden');
            }
        });

        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';

        setTimeout(function () {
            var visible = grid.querySelectorAll('.pricing-card[data-category="' + tab + '"]');
            visible.forEach(function (card) {
                card.style.opacity = '1';
            });
        }, 50);
    }, 350);
}

function toggleMobileMenu() {
    var links = document.getElementById('navLinks');
    links.classList.toggle('hidden');
    links.classList.toggle('absolute');
    links.classList.toggle('top-full');
    links.classList.toggle('left-0');
    links.classList.toggle('w-full');
    links.classList.toggle('bg-white');
    links.classList.toggle('flex-col');
    links.classList.toggle('py-6');
    links.classList.toggle('border-b');
}

function openModal(packageName, price) {
    var overlay = document.getElementById('modalOverlay');
    var modal = document.getElementById('modal');
    
    document.getElementById('modalPackage').textContent = packageName;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('orderForm').reset();
    
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
        modal.classList.remove('scale-95');
        modal.classList.add('scale-100');
    }, 10);
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    var overlay = document.getElementById('modalOverlay');
    var modal = document.getElementById('modal');
    
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    modal.classList.remove('scale-100');
    modal.classList.add('scale-95');
    
    setTimeout(() => {
        overlay.classList.remove('flex');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
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

    var subject = encodeURIComponent('Inquiry: ' + pkg + ' - ₱' + price);
    var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Company: ' + company + '\n' +
        'Package: ' + pkg + ' (₱' + price + ')\n\n' +
        'Message:\n' + message
    );

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        window.location.href = 'mailto:contact@acutech.com?subject=' + subject + '&body=' + body;
    } else {
        window.open('https://mail.google.com/mail/?view=cm&fs=1&to=contact@acutech.com&su=' + subject + '&body=' + body, '_blank');
    }
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

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        window.location.href = 'mailto:contact@acutech.com?subject=' + subject + '&body=' + body;
    } else {
        window.open('https://mail.google.com/mail/?view=cm&fs=1&to=contact@acutech.com&su=' + subject + '&body=' + body, '_blank');
    }
    document.getElementById('contactForm').reset();
}

document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
        var nav = document.getElementById('navbar');
        // Handle menu close for tailwind utility classes
        var links = document.getElementById('navLinks');
        if(!links.classList.contains('md:flex') && !links.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    });
});
