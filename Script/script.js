// Toggle class active

const navbarNav = document.querySelector('.nav');

// onclick
document.querySelector('#menu').onclick = () => {
    navbarNav.classList.toggle('active');
};

// disappear
const hamburger = document.querySelector('#menu');

document.addEventListener('click', function(e) {
    if(!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    };
});