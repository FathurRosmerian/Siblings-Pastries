// ==========================================================================
// 1. NAVIGASI MOBILE (HAMBURGER TOGGLE)
// ==========================================================================
const navbarNav = document.querySelector('.nav');
const hamburger = document.querySelector('#menu');
const navbar = document.querySelector('.navbar');
const topBar = document.querySelector('.top-bar');
const backToTopBtn = document.getElementById('backToTop');

if (hamburger && navbarNav) {
    // Klik hamburger untuk buka/tutup menu
    hamburger.onclick = (e) => {
        e.preventDefault();
        navbarNav.classList.toggle('active');
    };

    // Tutup menu otomatis jika user mengklik area luar
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
            navbarNav.classList.remove('active');
        }
    });

    // Tutup menu setelah salah satu link ditekan
    document.querySelectorAll('.navbar .nav a').forEach(link => {
        link.addEventListener('click', () => {
            navbarNav.classList.remove('active');
        });
    });
}

// ==========================================================================
// 2. SMART AUTO-HIDE NAVBAR & TOMBOL BACK TO TOP
// ==========================================================================
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Munculkan tombol Back to Top jika scroll lebih dari 300px
    if (backToTopBtn) {
        if (currentScroll > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    // Sembunyikan navbar saat scroll ke bawah, munculkan kembali saat scroll ke atas
    if (currentScroll > lastScrollTop && currentScroll > 80) {
        // Sedang scroll ke bawah
        if (navbar) navbar.classList.add('hide');
        if (topBar) topBar.classList.add('hide');

        // Tutup menu samping jika masih terbuka
        if (navbarNav && navbarNav.classList.contains('active')) {
            navbarNav.classList.remove('active');
        }
    } else {
        // Sedang scroll ke atas
        if (navbar) navbar.classList.remove('hide');
        if (topBar) topBar.classList.remove('hide');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// Aksi Klik Smooth Scroll ke Paling Atas
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================================================
// 3. AUTOPLAY VIDEO DI DALAM HERO CARD
// ==========================================================================
const heroVideo = document.querySelector('.hero-video-box video');
if (heroVideo) {
    heroVideo.muted = true; // Wajib muted agar diizinkan browser
    heroVideo.play().catch(err => {
        console.log("Autoplay ditunda oleh browser:", err);
    });
}

// ==========================================================================
// 4. PRICE LIST AUTO-SLIDER (3 DETIK + TOUCH SWIPE ANDROID & IOS)
// ==========================================================================
const sliderTrack = document.getElementById('sliderTrack');
const slides = document.querySelectorAll('.slider-track .slide');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const dotsContainer = document.getElementById('sliderDots');
const sliderContainer = document.getElementById('priceSlider');

if (sliderTrack && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideTimer = null;

    // A. Buat Dots Dinamis
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                restartAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });
    }

    const dots = document.querySelectorAll('.slider-dots .dot');

    // B. Fungsi Pindah Slide
    function updateSlider() {
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    // C. Tombol Next / Prev Manual
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            restartAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            restartAutoSlide();
        });
    }

    // D. Timer Auto-Slide 3 Detik (3000ms)
    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, 3000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideTimer);
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    startAutoSlide();

    // Jeda otomatis jika mouse berada di atas slider
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);

        // E. Touch Swipe untuk Layar Sentuh Smartphone (Android & iOS)
        let touchStartX = 0;
        let touchEndX = 0;

        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 40;
            if (touchEndX < touchStartX - threshold) {
                nextSlide();
            } else if (touchEndX > touchStartX + threshold) {
                prevSlide();
            }
            startAutoSlide();
        }, { passive: true });
    }
}

// Inisialisasi Feather Icons
if (window.feather) {
    feather.replace();
}