/**
 * Budgetly — Toast Notification Component
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 */

const Toast = (() => {
    const container = document.getElementById("toast-container");

    const ICONS = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
    };

    /**
     * Show a toast notification
     * @param {string} message
     * @param {string} type - success | error | warning | info
     * @param {number} duration - ms
     */
    function show(message, type = "info", duration = 3000) {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerHTML = `
      <span class="toast-icon">${ICONS[type] || ICONS.info}</span>
      <span>${Utils.escapeHtml(message)}</span>
    `;
        toast.style.animationDuration = "0.3s, 0.3s";
        toast.style.animationDelay = `0s, ${(duration - 300) / 1000}s`;

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }

    function success(msg) {
        show(msg, "success");
    }
    function error(msg) {
        show(msg, "error");
    }
    function warning(msg) {
        show(msg, "warning");
    }
    function info(msg) {
        show(msg, "info");
    }

    return { show, success, error, warning, info };
})();
