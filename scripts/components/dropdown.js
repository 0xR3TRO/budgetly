/**
 * Budgetly — Dropdown Component
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 */

const Dropdown = (() => {
    // Close all dropdowns when clicking outside
    document.addEventListener("click", (e) => {
        document.querySelectorAll(".dropdown-menu.open").forEach((menu) => {
            if (!menu.parentElement.contains(e.target)) {
                menu.classList.remove("open");
            }
        });
    });

    /**
     * Toggle a dropdown menu
     */
    function toggle(menuElement) {
        const isOpen = menuElement.classList.contains("open");
        // Close all
        document
            .querySelectorAll(".dropdown-menu.open")
            .forEach((m) => m.classList.remove("open"));
        if (!isOpen) {
            menuElement.classList.add("open");
        }
    }

    /**
     * Create a dropdown component
     * @param {string} triggerHTML
     * @param {Array} items - [{ label, icon?, action }]
     */
    function create(triggerHTML, items) {
        const wrapper = document.createElement("div");
        wrapper.className = "dropdown";

        const trigger = document.createElement("button");
        trigger.className = "btn btn-secondary btn-sm";
        trigger.innerHTML = triggerHTML;

        const menu = document.createElement("div");
        menu.className = "dropdown-menu";

        items.forEach((item) => {
            const btn = document.createElement("button");
            btn.className = "dropdown-item";
            btn.innerHTML =
                (item.icon ? item.icon + " " : "") +
                Utils.escapeHtml(item.label);
            btn.onclick = () => {
                menu.classList.remove("open");
                if (item.action) item.action();
            };
            menu.appendChild(btn);
        });

        trigger.onclick = (e) => {
            e.stopPropagation();
            toggle(menu);
        };

        wrapper.appendChild(trigger);
        wrapper.appendChild(menu);
        return wrapper;
    }

    return { toggle, create };
})();
