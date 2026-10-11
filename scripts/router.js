/**
 * Budgetly — Router (Hash-based SPA routing)
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 */

const Router = (() => {
    const routes = {
        dashboard: {
            title: "Dashboard",
            render: () => DashboardView.render(),
        },
        expenses: {
            title: "Expenses",
            render: () => ExpensesView.render(),
        },
        categories: {
            title: "Categories",
            render: () => CategoriesView.render(),
        },
        settings: {
            title: "Settings",
            render: () => SettingsView.render(),
        },
    };

    let currentView = "dashboard";

    function init() {
        window.addEventListener("hashchange", _onHashChange);
        _onHashChange();
    }

    function _onHashChange() {
        const hash = window.location.hash.replace("#", "") || "dashboard";
        navigate(hash, false);
    }

    function navigate(view, pushHash = true) {
        if (!routes[view]) view = "dashboard";
        currentView = view;

        if (pushHash) {
            window.location.hash = view;
        }

        // Update page title
        const pageTitleEl = document.getElementById("page-title");
        if (pageTitleEl) pageTitleEl.textContent = routes[view].title;

        // Update nav active state
        document.querySelectorAll(".nav-item").forEach((item) => {
            item.classList.toggle("active", item.dataset.view === view);
        });

        // Close mobile sidebar
        const sidebar = document.getElementById("sidebar");
        if (sidebar) sidebar.classList.remove("open");

        // Render view
        routes[view].render();

        // Update document title
        document.title = `${routes[view].title} — Budgetly`;
    }

    function getCurrentView() {
        return currentView;
    }

    return { init, navigate, getCurrentView };
})();
