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


// =========================================================================
// 1. UI Setup & DOM Preparation (Runs immediately)
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {

    // --- Mobile Menu Setup ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('header ul');
    if (navMenu && mobileMenuBtn) {
        const navItemsList = navMenu.querySelectorAll('li');
        const hamburgerLines = document.querySelectorAll('.hamburger-line');
        const navLinks = navMenu.querySelectorAll('a');

        let mm = gsap.matchMedia();

        mm.add("(max-width: 767px)", () => {
            const menuTl = gsap.timeline({ paused: true, reversed: true });
            const originalParent = navMenu.parentNode;
            document.body.appendChild(navMenu);

            gsap.set(navMenu, {
                position: "fixed", top: 0, left: 0, width: "100%", height: "100dvh",
                backgroundColor: "#FD5B03", zIndex: 40, display: "none", flexDirection: "column",
                justifyContent: "center", alignItems: "center", gap: "1.2rem", padding: "0",
                borderRadius: "0", border: "none", boxShadow: "none", autoAlpha: 0
            });

            gsap.set(navItemsList, { autoAlpha: 0, y: 40 });
            gsap.set(navLinks, { fontFamily: "'Anton', sans-serif", textTransform: "uppercase", fontSize: "2.5rem", fontWeight: "400", color: "#ffffff", letterSpacing: "1px" });

            menuTl.to(hamburgerLines[0], { y: 6, rotation: 45, duration: 0.3, ease: "power2.inOut" }, 0)
                .to(hamburgerLines[1], { autoAlpha: 0, duration: 0.3, ease: "power2.inOut" }, 0)
                .to(hamburgerLines[2], { y: -6, rotation: -45, duration: 0.3, ease: "power2.inOut" }, 0)
                .to(navMenu, { display: "flex", autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.3)
                .to(navItemsList, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" }, 0.5);

            const toggleMenu = () => menuTl.reversed() ? menuTl.play() : menuTl.reverse();
            mobileMenuBtn.addEventListener('click', toggleMenu);

            const handleLinkClick = function (e) {
                e.preventDefault();
                const targetUrl = this.getAttribute('href');
                menuTl.reverse().then(() => { if (targetUrl && targetUrl !== "#") window.location.href = targetUrl; });
            };

            navLinks.forEach(link => link.addEventListener('click', handleLinkClick));

            return () => {
                mobileMenuBtn.removeEventListener('click', toggleMenu);
                navLinks.forEach(link => link.removeEventListener('click', handleLinkClick));
                originalParent.appendChild(navMenu);
                gsap.set([navMenu, ...navItemsList, ...hamburgerLines, ...navLinks], { clearProps: "all" });
            };
        });

        // --- Dynamic Navbar Slider Animation ---
        const navSlider = document.createElement('div');
        navSlider.id = 'navSlider';
        navSlider.className = 'hidden md:block absolute bg-[rgba(255,255,255,0.15)] rounded-full transition-all duration-300 pointer-events-none opacity-0 left-0 z-0';
        navMenu.appendChild(navSlider);

        const navItems = navMenu.querySelectorAll('li:not(#navSlider)');

        function setSliderPosition(item) {
            if (window.innerWidth >= 768 && item) {
                navSlider.style.width = item.offsetWidth + 'px';
                navSlider.style.height = item.offsetHeight + 'px';
                navSlider.style.left = item.offsetLeft + 'px';
                navSlider.style.top = item.offsetTop + 'px';
                navSlider.style.opacity = '1';

                navItems.forEach(nav => {
                    const link = nav.querySelector('a');
                    if (link) link.style.removeProperty('color');
                });
                const activeLink = item.querySelector('a');
                if (activeLink) activeLink.style.setProperty('color', '#ffffff', 'important');
            }
        }

        setTimeout(() => { if (navItems.length > 0) setSliderPosition(navItems[0]); }, 250);

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
            item.addEventListener('mouseenter', function () { setSliderPosition(this); });
        });

        navMenu.addEventListener('mouseleave', function () {
            if (navItems.length > 0) setSliderPosition(navItems[0]);
        });
    }

    // --- Portfolio Filtering Logic ---
    const projectCards = document.querySelectorAll('.project-card');
    const desktopTabs = document.querySelectorAll('.filter-tab');
    const indicator = document.getElementById('tab-indicator');
    const mobileFilterBtn = document.getElementById('mobile-filter-btn');
    const mobileFilterList = document.getElementById('mobile-filter-list');
    const mobileFilterOptions = document.querySelectorAll('.mobile-filter-option');
    const mobileActiveText = document.getElementById('mobile-active-text');
    const dropdownIcon = document.getElementById('dropdown-icon');

    if (desktopTabs.length > 0) {
        function initIndicator() {
            const activeTab = document.querySelector('.filter-tab[data-filter="all"]');
            if (window.innerWidth >= 768 && activeTab && indicator) {
                indicator.style.width = activeTab.offsetWidth + 'px';
                indicator.style.left = activeTab.offsetLeft + 'px';
            }
        }
        setTimeout(initIndicator, 100);

        window.addEventListener('resize', () => {
            const currentActive = Array.from(desktopTabs).find(tab => tab.classList.contains('text-white'));
            if (window.innerWidth >= 768 && currentActive && indicator) {
                indicator.style.width = currentActive.offsetWidth + 'px';
                indicator.style.left = currentActive.offsetLeft + 'px';
            }
        });

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

        function filterProjects(filterValue) {
            projectCards.forEach(card => {
                gsap.to(card, {
                    scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
                    onComplete: () => {
                        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'block';
                            gsap.to(card, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" });
                        } else {
                            card.style.display = 'none';
                        }
                        if (window.ScrollTrigger) ScrollTrigger.refresh();
                    }
                });
            });
        }

        desktopTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                desktopTabs.forEach(t => { t.classList.remove('text-white'); t.classList.add('text-gray-500'); });
                this.classList.remove('text-gray-500'); this.classList.add('text-white');
                if (indicator) { indicator.style.width = this.offsetWidth + 'px'; indicator.style.left = this.offsetLeft + 'px'; }
                filterProjects(this.getAttribute('data-filter'));
                if (mobileActiveText) mobileActiveText.innerText = this.innerText;
            });
        });

        if (mobileFilterOptions.length > 0) {
            mobileFilterOptions.forEach(option => {
                option.addEventListener('click', function () {
                    const filterValue = this.getAttribute('data-filter');
                    mobileActiveText.innerText = this.innerText;
                    mobileFilterList.classList.remove('scale-y-100', 'opacity-100');
                    mobileFilterList.classList.add('scale-y-0', 'opacity-0');
                    dropdownIcon.style.transform = 'rotate(0deg)';
                    filterProjects(filterValue);
                    desktopTabs.forEach(t => {
                        t.classList.remove('text-white'); t.classList.add('text-gray-500');
                        if (t.getAttribute('data-filter') === filterValue) {
                            t.classList.add('text-white');
                            if (indicator) { indicator.style.width = t.offsetWidth + 'px'; indicator.style.left = t.offsetLeft + 'px'; }
                        }
                    });
                });
            });
        }
    }

    // --- Testimonial Slider ---
    const testimonialSlider = document.getElementById('testimonial-slider');
    if (testimonialSlider) {
        const splide = new Splide(testimonialSlider, {
            type: 'fade', rewind: true, perPage: 1, autoplay: true, interval: 5000, gap: '30px', arrows: false, pagination: false, speed: 800, easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
        }).mount();
        const prevBtns = document.querySelectorAll('#testi-prev, #testi-prev-mobile');
        const nextBtns = document.querySelectorAll('#testi-next, #testi-next-mobile');
        prevBtns.forEach(btn => { if (btn) btn.addEventListener('click', () => splide.go('<')); });
        nextBtns.forEach(btn => { if (btn) btn.addEventListener('click', () => splide.go('>')); });
    }

    // =========================================================================
    // TEXT SPLITTING (Must happen before ANY ScrollTriggers are created)
    // =========================================================================

    // 1. Hero Title
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        const titleWords = heroTitle.innerHTML.split(/<br\s*\/?>|\s+/);
        heroTitle.innerHTML = titleWords.map(word => {
            if (word.trim() === '') return '';
            return `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full opacity-0 gsap-word">${word}</span></span>`;
        }).join(' ');
    }

    // 2. Text Reveal (Gray to Black)
    const revealText = document.getElementById('reveal-text');
    if (revealText) {
        const words = revealText.innerText.split(' ');
        revealText.innerHTML = '';
        words.forEach(word => {
            const span = document.createElement('span');
            span.innerText = word + ' ';
            span.className = 'text-[#9ca3af] transition-colors duration-300';
            revealText.appendChild(span);
        });
    }

    // 3. Headings Reveal
    const revealElements = document.querySelectorAll('.gsap-scroll-reveal');
    revealElements.forEach(element => {
        if (!element.classList.contains('bg-clip-text')) {
            const words = element.innerHTML.split(/(<br\s*\/?>|\s+)/);
            element.innerHTML = words.map(word => {
                if (/^\s+$/.test(word) || /<br\s*\/?>/.test(word) || word === '') return word;
                return `<span class="inline-block overflow-hidden align-bottom"><span class="inline-block translate-y-full opacity-0 gsap-reveal-word">${word}</span></span>`;
            }).join('');
        }
    });

    // ==========================================
    // 3D Parallax Mouse Move Effect on Header
    // ==========================================
    const heroHeader = document.querySelector('.home-header');
    const heroProfileImg = document.querySelector('.hero-profile-image');
    const heroBtnGroup = document.getElementById('hero-btn-group');
    // H1 সিলেক্ট করা হলো
    const heroHeadingParallax = document.getElementById('heroTitle');

    if (heroHeader && heroProfileImg && heroBtnGroup && heroHeadingParallax) {
        heroHeader.addEventListener("mousemove", (e) => {
            let xAxis = (e.clientX / window.innerWidth - 0.5) * 2;
            let yAxis = (e.clientY / window.innerHeight - 0.5) * 2;

            // মানুষের ইমেজে 3D মুভমেন্ট
            gsap.to(heroProfileImg, {
                x: xAxis * 30,
                y: yAxis * 30,
                rotationY: xAxis * 15,
                rotationX: -yAxis * 15,
                transformPerspective: 1000,
                ease: "power2.out",
                duration: 0.6
            });

            // H1 (Title) এ প্যারাল্যাক্স মুভমেন্ট (ইমেজের উল্টো দিকে, একটু বেশি)
            gsap.to(heroHeadingParallax, {
                x: -xAxis * 25,
                y: -yAxis * 25,
                ease: "power2.out",
                duration: 0.6
            });

            // বাটনগুলোতে প্যারাল্যাক্স মুভমেন্ট (ইমেজের উল্টো দিকে, একটু কম)
            gsap.to(heroBtnGroup, {
                x: -xAxis * 15,
                y: -yAxis * 15,
                ease: "power2.out",
                duration: 0.6
            });
        });

        // মাউস হেডার থেকে বের হলে রিসেট
        heroHeader.addEventListener("mouseleave", () => {
            gsap.to([heroProfileImg, heroBtnGroup, heroHeadingParallax], {
                x: 0,
                y: 0,
                rotationY: 0,
                rotationX: 0,
                ease: "power3.out",
                duration: 1
            });
        });
    }

});


// =========================================================================
// 2. ALL SCROLL ANIMATIONS (Fires ONLY after everything is fully loaded)
// =========================================================================
window.addEventListener("load", () => {

    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        let mm = gsap.matchMedia();

        // 1. Hero Title Anim
        if (document.querySelector('.gsap-word')) {
            gsap.to(".gsap-word", { duration: 0.8, y: 0, opacity: 1, stagger: 0.15, delay: 0.2, ease: "power3.out" });
        }

        // 2. Text Reveal Anim
        if (document.querySelector('#reveal-text span')) {
            gsap.to('#reveal-text span', {
                color: "#1a1511", stagger: 0.1,
                scrollTrigger: { trigger: "#about-text-section", start: "top 75%", end: "center 40%", scrub: true }
            });
        }

        // 3. Counter Animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            ScrollTrigger.create({
                trigger: counter, start: "top 85%", once: true,
                onEnter: () => { gsap.to(counter, { innerHTML: target, duration: 2, snap: { innerHTML: 1 }, ease: "power2.out" }); }
            });
        });

        // 4. Pinned Section 1 (Stacked Cards)
        const cards = gsap.utils.toArray('.stacked-card');
        if (cards.length > 0) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#cards-wrapper",
                    start: "top 20%",
                    end: "+=200%",
                    scrub: 1,
                    pin: true,
                    refreshPriority: 10
                }
            });
            cards.slice(0, -1).forEach((card) => {
                tl.to(card, { y: window.innerHeight, opacity: 0, duration: 1, ease: "power2.inOut" });
            });
        }

        // 5. Pinned Section 2 (Solution Cards)
        const solutionCards = gsap.utils.toArray('.solution-card');
        if (solutionCards.length > 0) {
            mm.add("(min-width: 768px)", () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#solutions-section",
                        start: "top top",
                        end: "+=250%",
                        scrub: 1,
                        pin: true,
                        refreshPriority: 10
                    }
                });
                solutionCards.forEach((card, index) => {
                    if (index === 0) return;
                    const offset = card.offsetTop - solutionCards[0].offsetTop;
                    tl.from(card, { y: -offset, duration: 1, ease: "none" });
                });
                return () => { tl.kill(); };
            });
        }

        // 6. Headings Reveal (Updated with Blur + Fade Up)
        const revealElements = document.querySelectorAll('.gsap-scroll-reveal');
        revealElements.forEach(element => {
            if (element.classList.contains('bg-clip-text')) {
                gsap.fromTo(element,
                    { y: 40, opacity: 0, filter: "blur(10px)" },
                    {
                        scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none none" },
                        duration: 0.8, y: 0, opacity: 1, filter: "blur(0px)", ease: "power3.out"
                    }
                );
            } else {
                gsap.fromTo(element.querySelectorAll('.gsap-reveal-word'),
                    { y: "100%", opacity: 0, filter: "blur(10px)" },
                    {
                        scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none none" },
                        duration: 0.8, y: "0%", opacity: 1, filter: "blur(0px)", stagger: 0.15, ease: "power3.out"
                    }
                );
            }
        });

        // 7. Journey Cards Blur + Fade Up Stagger
        const journeyCards = gsap.utils.toArray('.journey-card');
        if (journeyCards.length > 0) {
            gsap.fromTo(journeyCards,
                { y: 60, opacity: 0, filter: "blur(10px)" },
                {
                    scrollTrigger: { trigger: ".journey-cards-wrapper", start: "top 80%", toggleActions: "play none none none" },
                    y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.2, ease: "power3.out"
                }
            );
        }

        // 8. Footer Socials Reveal
        const footerSocials = document.querySelectorAll('#footer-socials a');
        if (footerSocials.length > 0) {
            gsap.fromTo(footerSocials,
                { y: 30, opacity: 0 },
                {
                    scrollTrigger: { trigger: "#footer-socials", start: "top 95%", toggleActions: "play none none none" },
                    y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out"
                }
            );
        }

        // Final Order Check for GSAP
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
    }
});

// Failsafe resize observer
document.addEventListener("DOMContentLoaded", () => {
    if (window.ResizeObserver && window.ScrollTrigger) {
        const ro = new ResizeObserver(() => {
            ScrollTrigger.sort();
            ScrollTrigger.refresh();
        });
        ro.observe(document.body);
    }
});