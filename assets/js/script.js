if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.3,
        infinite: false,
    });

    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
    }

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}





document.addEventListener("DOMContentLoaded", () => {

    // --- 1. GSAP matchMedia for flawless Mobile & Desktop handling ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navItemsList = navMenu.querySelectorAll('li');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');

    let mm = gsap.matchMedia();

    // Mobile Setup (Max-width 767px)
    mm.add("(max-width: 767px)", () => {
        const menuTl = gsap.timeline({ paused: true, reversed: true });

        gsap.set(navMenu, { autoAlpha: 0, scale: 0.95, y: -15, display: "none" });
        gsap.set(navItemsList, { autoAlpha: 0, x: 15 });

        menuTl.to(hamburgerLines[0], { y: 6, rotation: 45, duration: 0.3, ease: "power2.inOut" }, 0)
            .to(hamburgerLines[1], { autoAlpha: 0, duration: 0.3, ease: "power2.inOut" }, 0)
            .to(hamburgerLines[2], { y: -6, rotation: -45, duration: 0.3, ease: "power2.inOut" }, 0)
            .to(navMenu, { autoAlpha: 1, scale: 1, y: 0, display: "flex", duration: 0.4, ease: "back.out(1.2)" }, 0)
            .to(navItemsList, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }, 0.15);

        const toggleMenu = () => {
            menuTl.reversed() ? menuTl.play() : menuTl.reverse();
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);

        return () => {
            mobileMenuBtn.removeEventListener('click', toggleMenu);
            gsap.set([navMenu, ...navItemsList, ...hamburgerLines], { clearProps: "all" });
        };
    });


    // --- 2. Dynamic Navbar Slider Animation (WordPress Compatible) ---

    const navSlider = document.createElement('div');
    navSlider.id = 'navSlider';
    navSlider.className = 'hidden md:block absolute bg-[rgba(255,255,255,0.15)] rounded-full transition-all duration-300 pointer-events-none opacity-0 left-0 z-0';
    navMenu.appendChild(navSlider);

    const navItems = navMenu.querySelectorAll('li:not(#navSlider)');

    function setSliderPosition(item) {
        if (window.innerWidth >= 768 && item) {
            const width = item.offsetWidth;
            const height = item.offsetHeight;
            const left = item.offsetLeft;
            const top = item.offsetTop;

            navSlider.style.width = width + 'px';
            navSlider.style.height = height + 'px';
            navSlider.style.left = left + 'px';
            navSlider.style.top = top + 'px';
            navSlider.style.opacity = '1';

            navItems.forEach(nav => {
                const link = nav.querySelector('a');
                if (link) link.style.removeProperty('color');
            });
            const activeLink = item.querySelector('a');
            if (activeLink) activeLink.style.setProperty('color', '#ffffff', 'important');
        }
    }

    window.addEventListener('load', () => {
        if (navItems.length > 0) {
            setSliderPosition(navItems[0]);
        }
    });

    setTimeout(() => {
        if (navItems.length > 0) {
            setSliderPosition(navItems[0]);
        }
    }, 250);

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && navItems.length > 0) {
            setSliderPosition(navItems[0]);
        } else {
            navSlider.style.opacity = '0';
            navItems.forEach(nav => {
                const link = nav.querySelector('a');
                if (link) link.style.removeProperty('color');
            });
        }
    });

    navItems.forEach(item => {
        item.style.position = 'relative';
        item.style.zIndex = '10';

        item.addEventListener('mouseenter', function () {
            setSliderPosition(this);
        });
    });

    navMenu.addEventListener('mouseleave', function () {
        if (navItems.length > 0) {
            setSliderPosition(navItems[0]);
        }
    });


    // --- 3. GSAP Stagger Animation for Hero Title ---
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
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
    }

    // work section 
    // --- Text Reveal Animation (Gray to Black on Scroll) ---
    const revealText = document.getElementById('reveal-text');
    if (revealText) {
        // টেক্সটকে শব্দে ভাগ করে স্প্যানে যুক্ত করা হচ্ছে
        const words = revealText.innerText.split(' ');
        revealText.innerHTML = '';
        words.forEach(word => {
            const span = document.createElement('span');
            span.innerText = word + ' ';
            span.className = 'text-[#9ca3af] transition-colors duration-300'; // Initial Gray
            revealText.appendChild(span);
        });

        // স্ক্রল ট্রিগারের সাহায্যে কালার পরিবর্তন (Gray to Black)
        gsap.to(revealText.querySelectorAll('span'), {
            color: "#1a1511",
            stagger: 0.1,
            scrollTrigger: {
                trigger: "#about-text-section",
                start: "top 75%",
                end: "center 40%",
                scrub: true
            }
        });
    }

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');

        ScrollTrigger.create({
            trigger: counter,
            start: "top 85%", // স্ক্রিনে আসলে শুরু হবে
            once: true,       // একবারই অ্যানিমেট হবে
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    snap: { innerHTML: 1 }, // ডেসিমাল নাম্বার এড়াতে
                    ease: "power2.out"
                });
            }
        });
    });

});

document.addEventListener("DOMContentLoaded", () => {
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        const cards = gsap.utils.toArray('.stacked-card');

        if (cards.length > 0) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#cards-wrapper",
                    start: "top 20%",
                    end: "+=200%",
                    scrub: 1,
                    pin: true,
                }
            });

            cards.slice(0, -1).forEach((card) => {
                tl.to(card, {
                    y: window.innerHeight,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.inOut"
                });
            });
        }
    }
});

// document.addEventListener("DOMContentLoaded", () => {
//     // আগের সব GSAP কোড এখানে থাকবে...

//     // --- Strategic Brand Solutions Cards Animation ---
//     const solutionCards = gsap.utils.toArray('.solution-card');

//     if (solutionCards.length > 0) {
//         const tl = gsap.timeline({
//             scrollTrigger: {
//                 trigger: "#solutions-section",
//                 start: "top top",      // সেকশন টপে আসলে অ্যানিমেশন শুরু হবে
//                 end: "+=250%",         // স্ক্রল করার স্পেস
//                 scrub: 1,              // স্ক্রলের সাথে স্মুথলি মুভ করবে
//                 pin: true,             // সেকশন পিন করে রাখবে
//             }
//         });

//         // কার্ডগুলো ন্যাচারাল পজিশন থেকে উপরে টেনে এনে এক জায়গায় স্ট্যাক করে রাখা হচ্ছে
//         // এরপর স্ক্রল করলে একে একে নিচে নেমে ন্যাচারাল পজিশনে (y: 0) চলে যাবে
//         solutionCards.forEach((card, index) => {
//             if (index === 0) return; // প্রথম কার্ডটি স্থির থাকবে

//             // কার্ডটিকে কতটুকু উপরে তুলতে হবে তা ক্যালকুলেট করা হচ্ছে
//             const offset = card.offsetTop - solutionCards[0].offsetTop;

//             tl.from(card, {
//                 y: -offset, // স্ট্যাক করা অবস্থা থেকে শুরু
//                 duration: 1,
//                 ease: "none"
//             });
//         });
//     }
// });


document.addEventListener("DOMContentLoaded", () => {
        
        // Testimonial Slider Initialize
        const testimonialSlider = document.getElementById('testimonial-slider');
        
        if(testimonialSlider) {
            const splide = new Splide(testimonialSlider, {
                type: 'loop',
                perPage: 1,
                autoplay: true,
                interval: 5000,
                arrows: false, // ডিফল্ট অ্যারো অফ করা হয়েছে কারণ আমরা কাস্টম অ্যারো বানিয়েছি
                pagination: false, // নিচে ডট চাইলে true করে দিতে পারেন
                speed: 800,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
            }).mount();

            // Custom Arrows Logic
            const prevBtn = document.getElementById('testi-prev');
            const nextBtn = document.getElementById('testi-next');

            if(prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => {
                    splide.go('<'); // আগের স্লাইডে যাবে
                });
                
                nextBtn.addEventListener('click', () => {
                    splide.go('>'); // পরের স্লাইডে যাবে
                });
            }
        }
        
    });