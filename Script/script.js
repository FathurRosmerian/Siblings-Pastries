// Navigasi Hamburger
const navbarNav = document.querySelector('.nav');
const hamburger = document.querySelector('#menu');
const navbar = document.querySelector('.navbar');
const topBar = document.querySelector('.top-bar');
const backToTopBtn = document.getElementById('backToTop');

// 1. Toggle Hamburger Menu
if (hamburger && navbarNav) {
    hamburger.onclick = (e) => {
        e.preventDefault();
        navbarNav.classList.toggle('active');
    };

    // Tutup menu saat klik di luar
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
            navbarNav.classList.remove('active');
        }
    });

    // Tutup menu saat salah satu link diklik
    document.querySelectorAll('.navbar .nav a').forEach(link => {
        link.addEventListener('click', () => {
            navbarNav.classList.remove('active');
        });
    });
}

// 2. Logika Scroll: Sembunyikan Navbar & Munculkan Tombol Back to Top
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Tampilkan tombol 'Back to Top' jika scroll melebihi 300px
    if (currentScroll > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }

    // Scroll ke bawah: sembunyikan navbar
    // Scroll ke atas: tampilkan navbar kembali
    if (currentScroll > lastScrollTop && currentScroll > 80) {
        // Sedang scroll ke bawah
        navbar.classList.add('hide');
        if (topBar) topBar.classList.add('hide');

        // Tutup menu hamburger jika sedang terbuka saat user scroll
        if (navbarNav && navbarNav.classList.contains('active')) {
            navbarNav.classList.remove('active');
        }
    } else {
        // Sedang scroll ke atas
        navbar.classList.remove('hide');
        if (topBar) topBar.classList.remove('hide');
    }

    // Mencegah nilai negatif pada bouncing scroll di mobile
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// 3. Aksi Klik Tombol Back to Top (Smooth Scroll ke paling atas)
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 4. Inisialisasi Feather Icons
if (window.feather) {
    feather.replace();
}

// Memastikan video langsung berputar otomatis (Autoplay Guarantee)
const heroVideo = document.querySelector('.hero-video-box video');
if (heroVideo) {
    heroVideo.muted = true; // Pastikan suara mati agar diizinkan browser
    heroVideo.play().catch(error => {
        console.log("Autoplay dicegah oleh browser:", error);
    });
}
// =========================================
// Auto-Slider Price List (Slide setiap 3 detik)
// =========================================
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

    // 1. Buat titik indikator (dots) secara dinamis
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

    const dots = document.querySelectorAll('.slider-dots .dot');

    // 2. Fungsi berpindah slide
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

    // 3. Tombol manual Next & Prev
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

    // 4. Timer Auto-Slide (Setiap 3 Detik = 3000ms)
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

    // Jalankan timer
    startAutoSlide();

    // Jeda otomatis jika mouse diarahkan ke slider (agar pengunjung bisa membaca daftar harga)
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);

    // 5. Dukungan Sentuh (Touch Swipe) untuk Smartphone Android & iOS
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 40; // Sensitivitas geser minimal 40px
        if (touchEndX < touchStartX - threshold) {
            nextSlide(); // Geser ke kiri -> slide berikutnya
        }
        if (touchEndX > touchStartX + threshold) {
            prevSlide(); // Geser ke kanan -> slide sebelumnya
        }
    }
}