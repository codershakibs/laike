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
    const navMenu = document.querySelector('header ul');
    const navItemsList = navMenu.querySelectorAll('li');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    const navLinks = navMenu.querySelectorAll('a');

    let mm = gsap.matchMedia();

    // Mobile Setup (Max-width 767px)
    mm.add("(max-width: 767px)", () => {
        const menuTl = gsap.timeline({ paused: true, reversed: true });

        // HTML ক্লাসে হাত না দিয়ে JS দিয়ে ফুল-স্ক্রিন স্টাইল সেট করা হচ্ছে
        gsap.set(navMenu, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100dvh",
            backgroundColor: "#FD5B03", // ব্যাকগ্রাউন্ড কালার আপডেট করা হয়েছে
            zIndex: 40,
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.2rem", // গ্যাপ কমানো হয়েছে
            padding: "0",
            borderRadius: "0",
            border: "none",
            boxShadow: "none",
            autoAlpha: 0
        });

        gsap.set(navItemsList, { autoAlpha: 0, y: 40 });

        // মোবাইলের জন্য লিংকের ফন্ট সাইজ ও ফ্যামিলি আপডেট করা হচ্ছে
        gsap.set(navLinks, {
            fontFamily: "'Anton', sans-serif", // Anton ফন্ট যুক্ত করা হয়েছে
            textTransform: "uppercase",        // বড় হাতের লেখা
            fontSize: "2.5rem",                // ফন্ট সাইজ
            fontWeight: "400",
            color: "#ffffff",
            letterSpacing: "1px"
        });

        // স্টেপ ১: প্রথমে হ্যামবার্গার আইকন ক্রস হবে
        menuTl.to(hamburgerLines[0], { y: 6, rotation: 45, duration: 0.3, ease: "power2.inOut" }, 0)
            .to(hamburgerLines[1], { autoAlpha: 0, duration: 0.3, ease: "power2.inOut" }, 0)
            .to(hamburgerLines[2], { y: -6, rotation: -45, duration: 0.3, ease: "power2.inOut" }, 0)

            // স্টেপ ২: এরপর ফুল স্ক্রিন ব্যাকগ্রাউন্ড আসবে
            .to(navMenu, { display: "flex", autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.3)

            // স্টেপ ৩: এরপর মেনু আইটেমগুলো নিচ থেকে উঠবে
            .to(navItemsList, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" }, 0.5);

        const toggleMenu = () => {
            menuTl.reversed() ? menuTl.play() : menuTl.reverse();
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);

        // লিংকে ক্লিক করলে মেনু আগে হাইড হবে, তারপর পেজ লোড হবে
        const handleLinkClick = function (e) {
            e.preventDefault();
            const targetUrl = this.getAttribute('href');

            menuTl.reverse().then(() => {
                if (targetUrl && targetUrl !== "#") {
                    window.location.href = targetUrl;
                }
            });
        };

        navLinks.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });

        return () => {
            mobileMenuBtn.removeEventListener('click', toggleMenu);
            navLinks.forEach(link => link.removeEventListener('click', handleLinkClick));
            gsap.set([navMenu, ...navItemsList, ...hamburgerLines, ...navLinks], { clearProps: "all" });
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
        const words = revealText.innerText.split(' ');
        revealText.innerHTML = '';
        words.forEach(word => {
            const span = document.createElement('span');
            span.innerText = word + ' ';
            span.className = 'text-[#9ca3af] transition-colors duration-300'; // Initial Gray
            revealText.appendChild(span);
        });

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
                    snap: { innerHTML: 1 }, // ডেসিমাল নাম্বার এড়াতে
                    ease: "power2.out"
                });
            }
        });
    });


    // =========================================================================
    // --- GSAP Scroll Animation for All Other Headings (Like H1) ---
    // =========================================================================
    if (window.gsap && window.ScrollTrigger) {
        const revealElements = document.querySelectorAll('.gsap-scroll-reveal');

        revealElements.forEach(element => {
            // চেক করা হচ্ছে এলিমেন্টে গ্রেডিয়েন্ট হোভার ক্লাস (bg-clip-text) আছে কিনা
            if (element.classList.contains('bg-clip-text')) {
                // থাকলে শব্দে ভাগ না করে পুরো এলিমেন্টটিকে এনিমেট করা হবে (CSS Hover ঠিক রাখার জন্য)
                gsap.from(element, {
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    duration: 0.8,
                    y: 40,
                    opacity: 0,
                    ease: "power3.out"
                    // onComplete রিমুভ করা হয়েছে গায়েব হওয়া ঠেকাতে
                });
            } else {
                // না থাকলে H1 এর মতো স্প্লিট করে অ্যানিমেট করা হবে
                const words = element.innerHTML.split(/(<br\s*\/?>|\s+)/);

                element.innerHTML = words.map(word => {
                    if (/^\s+$/.test(word) || /<br\s*\/?>/.test(word) || word === '') {
                        return word;
                    }
                    return `<span class="inline-block overflow-hidden align-bottom"><span class="inline-block translate-y-full opacity-0 gsap-reveal-word">${word}</span></span>`;
                }).join('');

                gsap.to(element.querySelectorAll('.gsap-reveal-word'), {
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    },
                    duration: 0.8,
                    y: 0,
                    opacity: 1,
                    stagger: 0.15,
                    ease: "power3.out"
                    // onComplete রিমুভ করা হয়েছে গায়েব হওয়া ঠেকাতে
                });
            }
        });
    }

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


document.addEventListener("DOMContentLoaded", () => {

    // --- Strategic Brand Solutions Cards Animation ---
    const solutionCards = gsap.utils.toArray('.solution-card');

    if (solutionCards.length > 0) {
        let mm = gsap.matchMedia();

        // অ্যানিমেশনটি শুধুমাত্র 768px (ট্যাবলেট/ডেস্কটপ) বা তার বড় স্ক্রিনে কাজ করবে
        mm.add("(min-width: 768px)", () => {

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#solutions-section",
                    start: "top top",
                    end: "+=250%",
                    scrub: 1,
                    pin: true,
                }
            });

            solutionCards.forEach((card, index) => {
                if (index === 0) return;

                const offset = card.offsetTop - solutionCards[0].offsetTop;

                tl.from(card, {
                    y: -offset,
                    duration: 1,
                    ease: "none"
                });
            });

            return () => {
                tl.kill();
            };
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {

    // Testimonial Slider Initialize
    const testimonialSlider = document.getElementById('testimonial-slider');

    if (testimonialSlider) {
        const splide = new Splide(testimonialSlider, {
            type: 'fade',      // 'loop' এর বদলে 'fade' ব্যবহার করা হয়েছে
            rewind: true,      // 'fade' টাইপে লুপের মতো বিহেভ করার জন্য এটি true করতে হয়
            perPage: 1,
            autoplay: true,
            interval: 5000,
            gap: '30px',
            arrows: false,     // ডিফল্ট অ্যারো অফ করা হয়েছে কারণ আমরা কাস্টম অ্যারো বানিয়েছি
            pagination: false, // নিচে ডট চাইলে true করে দিতে পারেন
            speed: 800,        // ফেড হওয়ার স্পিড
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',

        }).mount();

        // Custom Arrows Logic
        const prevBtns = document.querySelectorAll('#testi-prev, #testi-prev-mobile');
        const nextBtns = document.querySelectorAll('#testi-next, #testi-next-mobile');

        prevBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    splide.go('<'); // আগের স্লাইডে যাবে
                });
            }
        });

        nextBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    splide.go('>'); // পরের স্লাইডে যাবে
                });
            }
        });
    }

});

// tab 
document.addEventListener("DOMContentLoaded", () => {

    // --- Portfolio Filtering & Tab Slide Animation ---
    const tabs = document.querySelectorAll('.filter-tab');
    const indicator = document.getElementById('tab-indicator');
    const projectCards = document.querySelectorAll('.project-card');

    // Indicator কে ইনিশিয়ালি 'All' ট্যাবের সাইজে সেট করা হচ্ছে
    function initIndicator() {
        const activeTab = document.querySelector('.filter-tab[data-filter="all"]');
        if (activeTab && indicator) {
            indicator.style.width = activeTab.offsetWidth + 'px';
            indicator.style.left = activeTab.offsetLeft + 'px';
        }
    }

    initIndicator();

    // উইন্ডো রিসাইজ হলে ইন্ডিকেটরের পজিশন ঠিক রাখা
    window.addEventListener('resize', () => {
        const currentActive = Array.from(tabs).find(tab => tab.classList.contains('text-white'));
        if (currentActive && indicator) {
            indicator.style.width = currentActive.offsetWidth + 'px';
            indicator.style.left = currentActive.offsetLeft + 'px';
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {

            // ১. Tab Colors & Indicator Slide Update
            tabs.forEach(t => {
                t.classList.remove('text-white');
                t.classList.add('text-gray-500');
            });
            this.classList.remove('text-gray-500');
            this.classList.add('text-white');

            if (indicator) {
                indicator.style.width = this.offsetWidth + 'px';
                indicator.style.left = this.offsetLeft + 'px';
            }

            // ২. Cards Filtering Animation
            const filterValue = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                // কার্ড হাইড করা
                gsap.to(card, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        // হাইড হওয়ার পর ডিসপ্লে নান করা
                        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'block';
                            // ফিল্টার করা কার্ডগুলো শো করানো
                            gsap.to(card, {
                                scale: 1,
                                opacity: 1,
                                duration: 0.4,
                                ease: "back.out(1.2)"
                            });
                        } else {
                            card.style.display = 'none';
                        }

                        // কার্ড ফিল্টার হলে পেজের হাইট চেঞ্জ হতে পারে, তাই ScrollTrigger রিফ্রেশ করা হচ্ছে
                        if (window.ScrollTrigger) {
                            ScrollTrigger.refresh();
                        }
                    }
                });
            });
        });
    });

});

document.addEventListener("DOMContentLoaded", () => {

    // --- Portfolio Filtering Logic ---
    const projectCards = document.querySelectorAll('.project-card');

    // Desktop Variables
    const desktopTabs = document.querySelectorAll('.filter-tab');
    const indicator = document.getElementById('tab-indicator');

    // Mobile Variables
    const mobileFilterBtn = document.getElementById('mobile-filter-btn');
    const mobileFilterList = document.getElementById('mobile-filter-list');
    const mobileFilterOptions = document.querySelectorAll('.mobile-filter-option');
    const mobileActiveText = document.getElementById('mobile-active-text');
    const dropdownIcon = document.getElementById('dropdown-icon');

    // ==========================================
    // 1. Desktop Tab Slider Setup
    // ==========================================
    function initIndicator() {
        const activeTab = document.querySelector('.filter-tab[data-filter="all"]');
        if (window.innerWidth >= 768 && activeTab && indicator) {
            indicator.style.width = activeTab.offsetWidth + 'px';
            indicator.style.left = activeTab.offsetLeft + 'px';
        }
    }

    initIndicator();

    window.addEventListener('resize', () => {
        const currentActive = Array.from(desktopTabs).find(tab => tab.classList.contains('text-white'));
        if (window.innerWidth >= 768 && currentActive && indicator) {
            indicator.style.width = currentActive.offsetWidth + 'px';
            indicator.style.left = currentActive.offsetLeft + 'px';
        }
    });

    // ==========================================
    // 2. Mobile Dropdown Toggle Logic
    // ==========================================
    if (mobileFilterBtn) {
        mobileFilterBtn.addEventListener('click', () => {
            const isOpen = mobileFilterList.classList.contains('scale-y-100');
            if (isOpen) {
                mobileFilterList.classList.remove('scale-y-100', 'opacity-100');
                mobileFilterList.classList.add('scale-y-0', 'opacity-0');
                dropdownIcon.style.transform = 'rotate(0deg)';
            } else {
                mobileFilterList.classList.remove('scale-y-0', 'opacity-0');
                mobileFilterList.classList.add('scale-y-100', 'opacity-100');
                dropdownIcon.style.transform = 'rotate(180deg)';
            }
        });
    }

    // ==========================================
    // 3. Core Filtering Function (Used by both)
    // ==========================================
    function filterProjects(filterValue) {
        projectCards.forEach(card => {
            gsap.to(card, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        gsap.to(card, {
                            scale: 1,
                            opacity: 1,
                            duration: 0.4,
                            ease: "back.out(1.2)"
                        });
                    } else {
                        card.style.display = 'none';
                    }
                    if (window.ScrollTrigger) ScrollTrigger.refresh();
                }
            });
        });
    }

    // ==========================================
    // 4. Desktop Click Event
    // ==========================================
    desktopTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            desktopTabs.forEach(t => {
                t.classList.remove('text-white');
                t.classList.add('text-gray-500');
            });
            this.classList.remove('text-gray-500');
            this.classList.add('text-white');

            if (indicator) {
                indicator.style.width = this.offsetWidth + 'px';
                indicator.style.left = this.offsetLeft + 'px';
            }

            const filterValue = this.getAttribute('data-filter');
            filterProjects(filterValue);

            // Sync mobile text
            if (mobileActiveText) mobileActiveText.innerText = this.innerText;
        });
    });

    // ==========================================
    // 5. Mobile Click Event
    // ==========================================
    mobileFilterOptions.forEach(option => {
        option.addEventListener('click', function () {
            const filterValue = this.getAttribute('data-filter');
            const btnText = this.innerText;

            // Update button text and close dropdown
            mobileActiveText.innerText = btnText;
            mobileFilterList.classList.remove('scale-y-100', 'opacity-100');
            mobileFilterList.classList.add('scale-y-0', 'opacity-0');
            dropdownIcon.style.transform = 'rotate(0deg)';

            filterProjects(filterValue);

            // Sync desktop active tab silently
            desktopTabs.forEach(t => {
                t.classList.remove('text-white');
                t.classList.add('text-gray-500');
                if (t.getAttribute('data-filter') === filterValue) {
                    t.classList.add('text-white');
                    if (indicator) {
                        indicator.style.width = t.offsetWidth + 'px';
                        indicator.style.left = t.offsetLeft + 'px';
                    }
                }
            });
        });
    });

});
