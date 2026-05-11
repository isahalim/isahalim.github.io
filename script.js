document.addEventListener('DOMContentLoaded', () => {

    // Grab the theme toggle button and icon
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Function to update icon based on theme
    function updateIcon(isDark) {
        if (isDark) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
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

    // --- Wave Background Animation ---
    if (!isMobile()) {
        const waveContainer = document.createElement('div');
        waveContainer.className = 'wave-bg';
        waveContainer.style.transformOrigin = 'left center';
        document.body.prepend(waveContainer);

        const createHighlight = () => {
            const wrapper = document.createElement('div');
            wrapper.style.filter = 'blur(20px)';
            wrapper.style.position = 'absolute';
            wrapper.style.top = '0';
            wrapper.style.left = '0';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';

            const hl = document.createElement('div');
            hl.className = 'wave-highlight';
            wrapper.appendChild(hl);
            return { wrapper, hl };
        };

        const hl1Obj = createHighlight();
        const glass1 = document.createElement('div');
        glass1.className = 'wave-glass-pane';
        glass1.style.opacity = '0.3';

        const hl2Obj = createHighlight();
        const glass2 = document.createElement('div');
        glass2.className = 'wave-glass-pane';
        glass2.style.opacity = '0.6';

        const hl3Obj = createHighlight();
        const glass3 = document.createElement('div');
        glass3.className = 'wave-glass-pane';
        glass3.style.opacity = '1.0';

        waveContainer.appendChild(hl1Obj.wrapper);
        waveContainer.appendChild(glass1);
        waveContainer.appendChild(hl2Obj.wrapper);
        waveContainer.appendChild(glass2);
        waveContainer.appendChild(hl3Obj.wrapper);
        waveContainer.appendChild(glass3);

        let wavePhase = 0;
        let scrollVelocity = 0;
        let lastScrollY = window.scrollY;

        function animateWave() {
            let currentScrollY = window.scrollY;
            let deltaY = currentScrollY - lastScrollY;
            lastScrollY = currentScrollY;

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
                    let x = widthOffset +
                        Math.sin(normY * 0.005 + wavePhase + phaseOffset) * 25 * ampMult * (w / 100) +
                        Math.sin(normY * 0.01 + wavePhase * 1.5) * 15 * ampMult * (w / 100);

                    if (isHighlight) x += 15; // Shift highlight edge significantly so it blurs into a wide soft glow
                    pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
                }
                // Move the left edge deeply off-screen (-400px) to prevent it from clipping the wave
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
            waveContainer.style.transform = `scale(${scale}) rotate(${rotation}deg)`;

            requestAnimationFrame(animateWave);
        }
        requestAnimationFrame(animateWave);
    }
});