document.addEventListener('DOMContentLoaded', () => {

    // Grab the theme toggle button and icons
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIconSun = document.getElementById('theme-icon-sun');
    const themeIconMoon = document.getElementById('theme-icon-moon');

    // Function to update icon based on theme
    function updateIcon(isDark) {
        if (isDark) {
            if (themeIconSun) {
                themeIconSun.style.opacity = '0';
                themeIconSun.style.transform = 'rotate(90deg)';
            }
            if (themeIconMoon) {
                themeIconMoon.style.opacity = '1';
                themeIconMoon.style.transform = 'rotate(0deg)';
            }
        } else {
            if (themeIconSun) {
                themeIconSun.style.opacity = '1';
                themeIconSun.style.transform = 'rotate(0deg)';
            }
            if (themeIconMoon) {
                themeIconMoon.style.opacity = '0';
                themeIconMoon.style.transform = 'rotate(-90deg)';
            }
        }
    }

    // Function to handle the theme change
    function switchTheme(e) {
        e.preventDefault();
        const isDark = document.body.classList.toggle('dark-mode');
        if (isDark) {
            localStorage.setItem('theme', 'dark'); // Save preference
        } else {
            localStorage.setItem('theme', 'light'); // Save preference
        }
        updateIcon(isDark);
    }

    // Listen for clicks on the toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', switchTheme, false);
    }

    // Check if the user already selected a theme in a previous session
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            updateIcon(true);
        } else {
            updateIcon(false);
        }
    } else {
        document.body.classList.add('dark-mode');
        updateIcon(true);
    }

    // Helper to detect mobile
    const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

    // Restore "liveliness" on mobile by adding passive touchstart listeners.
    // This forces the mobile browser to immediately process touch events and
    // trigger CSS :hover/:active states without waiting for a full click, 
    // bridging the gap left by removing the constant requestAnimationFrame loop.
    if (isMobile()) {
        const interactiveElements = document.querySelectorAll('.project-card, .nav-btn, .social-btn, .project-card h3 a');
        interactiveElements.forEach(el => {
            el.addEventListener('touchstart', () => { }, { passive: true });
        });
    }

    // --- Wave Background Animation ---
    if (!isMobile()) {
        const waveContainer = document.createElement('div');
        waveContainer.className = 'wave-bg';
        waveContainer.style.transformOrigin = 'left center';

        // Force Hardware Acceleration
        waveContainer.style.willChange = 'transform';
        waveContainer.style.transform = 'translateZ(0)'; // Force GPU layer
        waveContainer.style.pointerEvents = 'none'; // CRITICAL: prevents it from intercepting clicks

        document.body.prepend(waveContainer);

        const createHighlight = () => {
            const wrapper = document.createElement('div');
            wrapper.style.filter = 'blur(8px)'; // Remove blur during intro
            wrapper.style.transition = 'filter 1s ease-in'; // Fade in transition
            wrapper.style.position = 'absolute';
            wrapper.style.top = '0';
            wrapper.style.left = '0';
            wrapper.style.width = '100vw';
            wrapper.style.height = '100%';

            const hl = document.createElement('div');
            hl.className = 'wave-highlight';
            hl.style.width = '100vw';
            wrapper.appendChild(hl);
            return { wrapper, hl };
        };

        const hl1Obj = createHighlight();
        const glass1 = document.createElement('div');
        glass1.className = 'wave-glass-pane';
        glass1.style.opacity = '0.3';
        glass1.style.width = '100vw';

        const hl2Obj = createHighlight();
        const glass2 = document.createElement('div');
        glass2.className = 'wave-glass-pane';
        glass2.style.opacity = '0.6';
        glass2.style.width = '100vw';

        const hl3Obj = createHighlight();
        const glass3 = document.createElement('div');
        glass3.className = 'wave-glass-pane';
        glass3.style.opacity = '1.0';
        glass3.style.width = '100vw';

        waveContainer.appendChild(hl1Obj.wrapper);
        waveContainer.appendChild(glass1);
        waveContainer.appendChild(hl2Obj.wrapper);
        waveContainer.appendChild(glass2);
        waveContainer.appendChild(hl3Obj.wrapper);
        waveContainer.appendChild(glass3);

        let wavePhase = 0;
        let scrollVelocity = 0;
        let lastScrollY = window.scrollY;

        let startTime = Date.now();
        const introDuration = 2500; // 2.5 seconds total

        function animateWave() {
            let currentScrollY = window.scrollY;
            let deltaY = currentScrollY - lastScrollY;
            lastScrollY = currentScrollY;

            let elapsed = Date.now() - startTime;
            let introProgress = Math.min(elapsed / introDuration, 1);

            let extraWidth = 0;
            let currentZIndex = waveContainer.style.zIndex;

            if (introProgress < 0.5) {
                // Phase 1: Sweep left offscreen
                if (currentZIndex !== '9999') waveContainer.style.zIndex = '9999';
                let p = introProgress / 0.5; // 0 to 1
                let easeIn = p * p * p; // Cubic ease in
                extraWidth = window.innerWidth - (window.innerWidth + 1500) * easeIn;
            } else if (introProgress < 1) {
                // Phase 2: Sweep right from offscreen to normal position
                if (currentZIndex !== '0') waveContainer.style.zIndex = '0';
                let p = (introProgress - 0.5) / 0.5; // 0 to 1
                let easeOut = 1 - Math.pow(1 - p, 3); // Cubic ease out
                extraWidth = -1500 + 1500 * easeOut;
            } else {
                if (currentZIndex !== '0') waveContainer.style.zIndex = '0';
                extraWidth = 0;

                // Fade the blur in only after introProgress >= 1
                if (hl1Obj.wrapper.style.filter !== 'blur(20px)') {
                    hl1Obj.wrapper.style.filter = 'blur(20px)';
                    hl2Obj.wrapper.style.filter = 'blur(20px)';
                    hl3Obj.wrapper.style.filter = 'blur(20px)';
                }
            }

            scrollVelocity = scrollVelocity * 0.9 + Math.abs(deltaY) * 0.1;

            // Base speed + scroll acceleration
            let speed = 0.005 + scrollVelocity * 0.0015;
            wavePhase += speed;

            let w = waveContainer.clientWidth || 400;
            let h = window.innerHeight;

            function makeClipPath(phaseOffset, ampMult, widthOffsetBase, isHighlight = false) {
                let pts = [];
                let steps = 40;
                let stepY = h / steps;

                for (let i = 0; i <= steps; i++) {
                    let y = i * stepY;
                    let normY = (y / h) * 1000; // normalize to keep wave shape consistent
                    let widthOffset = widthOffsetBase * (w / 100);
                    let x = widthOffset + extraWidth +
                        Math.sin(normY * 0.005 + wavePhase + phaseOffset) * 25 * ampMult * (w / 100) +
                        Math.sin(normY * 0.01 + wavePhase * 1.5) * 15 * ampMult * (w / 100);

                    if (isHighlight) x += 15; // Shift highlight edge significantly so it blurs into a wide soft glow
                    pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
                }
                // Use -400px to keep bounding box tighter and avoid Chrome memory/raster issues
                return `polygon(-400px 0px, ${pts.join(', ')}, -400px ${h}px)`;
            }

            const path1 = makeClipPath(0, 1.2, 50);
            const hlPath1 = makeClipPath(0, 1.2, 50, true);
            glass1.style.clipPath = path1; glass1.style.webkitClipPath = path1;
            hl1Obj.hl.style.clipPath = hlPath1; hl1Obj.hl.style.webkitClipPath = hlPath1;

            const path2 = makeClipPath(2, 1.0, 35);
            const hlPath2 = makeClipPath(2, 1.0, 35, true);
            glass2.style.clipPath = path2; glass2.style.webkitClipPath = path2;
            hl2Obj.hl.style.clipPath = hlPath2; hl2Obj.hl.style.webkitClipPath = hlPath2;

            const path3 = makeClipPath(4, 0.8, 20);
            const hlPath3 = makeClipPath(4, 0.8, 20, true);
            glass3.style.clipPath = path3; glass3.style.webkitClipPath = path3;
            hl3Obj.hl.style.clipPath = hlPath3; hl3Obj.hl.style.webkitClipPath = hlPath3;

            // Slow rotation and wavy transform
            let rotation = Math.sin(wavePhase * 0.3) * 2;
            let scale = 1.05 + Math.sin(wavePhase * 0.5) * 0.05;
            // Retain translateZ(0) for hardware acceleration
            waveContainer.style.transform = `scale(${scale}) rotate(${rotation}deg) translateZ(0)`;

            requestAnimationFrame(animateWave);
        }
        requestAnimationFrame(animateWave);
    }
});