/**
 * Budgetly — Tabs Component
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 */

const Tabs = (() => {
    /**
     * Create a tab group
     * @param {Array} tabDefs - [{ label, id, active? }]
     * @param {Function} onChange - (tabId) => {}
     * @returns {HTMLElement}
     */
    function create(tabDefs, onChange) {
        const wrapper = document.createElement("div");
        wrapper.className = "tabs";

        tabDefs.forEach((t) => {
            const tab = document.createElement("button");
            tab.className = "tab" + (t.active ? " active" : "");
            tab.textContent = t.label;
            tab.dataset.tabId = t.id;

            tab.onclick = () => {
                wrapper
                    .querySelectorAll(".tab")
                    .forEach((tb) => tb.classList.remove("active"));
                tab.classList.add("active");
                if (onChange) onChange(t.id);
            };

            wrapper.appendChild(tab);
        });

        return wrapper;
    }

    return { create };
})();
