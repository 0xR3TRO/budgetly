/**
 * Budgetly — Modal Component
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 */

const Modal = (() => {
    const overlay = document.getElementById("modal-overlay");
    const titleEl = document.getElementById("modal-title");
    const bodyEl = document.getElementById("modal-body");
    const footerEl = document.getElementById("modal-footer");
    const closeBtn = document.getElementById("modal-close");

    function open({ title = "", body = "", footer = "", onClose = null }) {
        titleEl.textContent = title;
        if (typeof body === "string") {
            bodyEl.innerHTML = body;
        } else {
            bodyEl.innerHTML = "";
            bodyEl.appendChild(body);
        }
        if (typeof footer === "string") {
            footerEl.innerHTML = footer;
        } else {
            footerEl.innerHTML = "";
            footerEl.appendChild(footer);
        }
        overlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";

        closeBtn.onclick = () => {
            close();
            if (onClose) onClose();
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                close();
                if (onClose) onClose();
            }
        };

        // ESC key
        document.addEventListener("keydown", _escHandler);
    }

    function close() {
        overlay.classList.add("hidden");
        document.body.style.overflow = "";
        document.removeEventListener("keydown", _escHandler);
    }

    function _escHandler(e) {
        if (e.key === "Escape") close();
    }

    /**
     * Confirm dialog
     */
    function confirm({
        title = "Confirm",
        message = "Are you sure?",
        confirmText = "Confirm",
        cancelText = "Cancel",
        danger = false,
    }) {
        return new Promise((resolve) => {
            const footer = document.createElement("div");
            footer.style.display = "flex";
            footer.style.gap = "10px";
            footer.style.justifyContent = "flex-end";

            const cancelBtn = document.createElement("button");
            cancelBtn.className = "btn btn-secondary";
            cancelBtn.textContent = cancelText;
            cancelBtn.onclick = () => {
                close();
                resolve(false);
            };

            const confirmBtn = document.createElement("button");
            confirmBtn.className = danger
                ? "btn btn-danger"
                : "btn btn-primary";
            confirmBtn.textContent = confirmText;
            confirmBtn.onclick = () => {
                close();
                resolve(true);
            };

            footer.appendChild(cancelBtn);
            footer.appendChild(confirmBtn);

            open({
                title,
                body: `<p style="color: var(--text-secondary); font-size: 0.9rem;">${message}</p>`,
                footer,
            });
        });
    }

    return { open, close, confirm };
})();
