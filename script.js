document.addEventListener('DOMContentLoaded', () => {

    // ─── How the layer stack works ─────────────────────────────────────────────
    //
    //  z-index: -1   #fluid-canvas      WebGL fluid simulation (background)
    //  z-index:  0   liquidGL canvas    Alpha-transparent WebGL canvas;
    //                                   glass panes are drawn here, the rest
    //                                   is fully transparent so the fluid
    //                                   shows through as the live background.
    //  z-index:  1+  Regular DOM        Header, sidebar content, main panel.
    //
    //  liquidGL takes an html2canvas snapshot of the page (which skips
    //  position:fixed elements, so the fluid canvas is excluded).  The glass
    //  panes then refract that page-content snapshot — text, profile photo,
    //  buttons — giving them a proper refracting-glass look.  The fluid is
    //  visible through both the transparent regions of the liquidGL canvas
    //  and as a coloured backdrop seen through the glass bevel/specular edges.
    //
    //  NO texture patching is needed.  Attempting to composite the raw fluid
    //  pixels into the snapshot texture causes a black slab because:
    //    a) Canvas2D's ctx.filter for drawImage is inconsistently supported,
    //       so the invert(1) silently fails, and
    //    b) generateColor() dims all fluid colours by *0.15, making the raw
    //       WebGL pixels nearly black before any CSS inversion is applied.
    // ──────────────────────────────────────────────────────────────────────────

    // ─── 1. Sidebar glass slab ────────────────────────────────────────────────
    // new liquidGL({
    //     target: "#sidebar-glass",
    //     resolution: 1.5,
    //     refraction: 0.05,
    //     bevelDepth: 0.15,
    //     bevelWidth: 0.2,
    //     frost: 0,
    //     shadow: true,
    //     specular: true,
    //     tilt: true,
    //     tiltFactor: 5,
    //     reveal: "none"
    // });

    // ─── 2. Pill buttons (nav + social) ───────────────────────────────────────
    // new liquidGL({
    //     target: ".liquid-btn",
    //     resolution: 1.5,
    //     refraction: 0.05,
    //     bevelDepth: 0.15,
    //     bevelWidth: 0.2,
    //     frost: 0,
    //     shadow: true,
    //     specular: true,
    //     tilt: true,
    //     tiltFactor: 5,
    //     reveal: "none"
    // });

    // Grab the toggle switch
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

    // Function to handle the theme change
    function switchTheme(e) {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark'); // Save preference
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light'); // Save preference
        }
    }

    // Listen for clicks on the toggle
    toggleSwitch.addEventListener('change', switchTheme, false);

    // Check if the user already selected a theme in a previous session
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            toggleSwitch.checked = true; // Make sure the switch shows as "on"
        }
    }
});