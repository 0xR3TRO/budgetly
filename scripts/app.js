/**
 * Budgetly — Main Application Entry Point
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 *
 * A complete, production-ready browser-based expense tracker.
 * Built with pure HTML, CSS, and vanilla JavaScript — no frameworks.
 *
 * Repository: https://github.com/0xR3TRO/Budgetly
 * License: MIT
 */

const App = (() => {
    function init() {
        // Initialize storage (default data)
        Storage.init();

        // Apply saved theme
        _applyTheme();

        // Setup sidebar navigation
        _setupNavigation();

        // Setup mobile menu
        _setupMobileMenu();

        // Setup theme toggle
        _setupThemeToggle();

        // Setup global search
        _setupGlobalSearch();

        // Initialize router (will render initial view)
        Router.init();

        // Window resize: redraw charts
        window.addEventListener(
            "resize",
            Utils.debounce(() => {
                if (Router.getCurrentView() === "dashboard") {
                    DashboardView.render();
                }
            }, 300),
        );

        console.log(
            "%c💰 Budgetly v1.0.0 — by 0xR3TRO",
            "color: #6c5ce7; font-size: 14px; font-weight: bold;",
        );
        console.log("%chttps://github.com/0xR3TRO/Budgetly", "color: #a29bfe;");
    }

    function _applyTheme() {
        const settings = Storage.getSettings();
        const theme = settings.theme || "light";
        document.documentElement.setAttribute("data-theme", theme);
        const toggleBtn = document.getElementById("theme-toggle");
        if (toggleBtn) {
            toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
        }
    }

    function _setupNavigation() {
        document.querySelectorAll(".nav-item").forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                if (view) Router.navigate(view);
            });
        });
    }

    function _setupMobileMenu() {
        const mobileBtn = document.getElementById("mobile-menu-btn");
        const sidebar = document.getElementById("sidebar");

        if (mobileBtn && sidebar) {
            mobileBtn.addEventListener("click", () => {
                sidebar.classList.toggle("open");
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener("click", (e) => {
                if (
                    window.innerWidth <= 768 &&
                    sidebar.classList.contains("open") &&
                    !sidebar.contains(e.target) &&
                    e.target !== mobileBtn
                ) {
                    sidebar.classList.remove("open");
                }
            });
        }
    }

    function _setupThemeToggle() {
        const toggleBtn = document.getElementById("theme-toggle");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                const settings = Storage.getSettings();
                const newTheme = settings.theme === "dark" ? "light" : "dark";
                Storage.updateSettings({ theme: newTheme });
                document.documentElement.setAttribute("data-theme", newTheme);
                toggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
            });
        }
    }

    function _setupGlobalSearch() {
        const searchInput = document.getElementById("global-search");
        if (searchInput) {
            searchInput.addEventListener(
                "input",
                Utils.debounce((e) => {
                    const query = e.target.value.trim();
                    if (query) {
                        // Switch to expenses view and search
                        Router.navigate("expenses");
                        ExpensesView.setSearch(query);
                    }
                }, 350),
            );

            // Enter key
            searchInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const query = e.target.value.trim();
                    Router.navigate("expenses");
                    ExpensesView.setSearch(query);
                }
            });
        }
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
        // Ctrl/Cmd + K = focus search
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
            e.preventDefault();
            const searchInput = document.getElementById("global-search");
            if (searchInput) searchInput.focus();
        }
    });

    return { init };
})();

// Boot the application
document.addEventListener("DOMContentLoaded", () => {
    App.init();
});
