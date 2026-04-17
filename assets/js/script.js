
// 1. Mobile Menu Toggle with GSAP
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
let isMobileMenuOpen = false;

// Initial Setup based on screen size
function setupMenu() {
    if (window.innerWidth < 768) {
        gsap.set(navMenu, { autoAlpha: 0, y: -20, display: "none" });
        isMobileMenuOpen = false;
    } else {
        gsap.set(navMenu, { clearProps: "all" }); // Clear GSAP styles on desktop
    }
}

setupMenu();
window.addEventListener('resize', setupMenu);

mobileMenuBtn.addEventListener('click', () => {
    if (!isMobileMenuOpen) {
        // Open Animation
        gsap.to(navMenu, { duration: 0.4, autoAlpha: 1, y: 0, display: "flex", ease: "power3.out" });
        isMobileMenuOpen = true;
    } else {
        // Close Animation
        gsap.to(navMenu, { duration: 0.3, autoAlpha: 0, y: -20, display: "none", ease: "power3.in" });
        isMobileMenuOpen = false;
    }
});

// 2. Dynamic Navbar Slider Animation (Desktop Only)
const navSlider = document.getElementById('navSlider');
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
        if (window.innerWidth >= 768) {
            const width = this.offsetWidth;
            const left = this.offsetLeft;

            navSlider.style.width = width + 'px';
            navSlider.style.left = left + 'px';
            navSlider.style.opacity = '1';
        }
    });

    item.addEventListener('mouseleave', function () {
        if (window.innerWidth >= 768) {
            navSlider.style.opacity = '0';
        }
    });
});

// 3. GSAP Stagger Animation for Title
const heroTitle = document.getElementById('heroTitle');
const titleWords = heroTitle.innerHTML.split(/<br\s*\/?>|\s+/);

heroTitle.innerHTML = titleWords.map(word => {
    if (word.trim() === '') return '';
    return `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full opacity-0 gsap-word">${word}</span></span>`;
}).join(' ');

gsap.to(".gsap-word", {
    duration: 0.8,
    y: 0,
    opacity: 1,
    stagger: 0.15,
    delay: 0.2,
    ease: "power3.out"
});




