/**
 * Budgetly — Utility Functions
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 */

const Utils = (() => {
    /**
     * Generate a UUID v4
     */
    function generateId() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    /**
     * Format amount as currency
     */
    function formatCurrency(amount, currency = "USD") {
        const symbols = {
            USD: "$",
            EUR: "€",
            GBP: "£",
            PLN: "zł",
            JPY: "¥",
            CHF: "CHF",
        };
        const symbol = symbols[currency] || currency;
        const num = parseFloat(amount) || 0;
        if (currency === "PLN") {
            return (
                num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                " " +
                symbol
            );
        }
        return symbol + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * Format date to locale string
     */
    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    /**
     * Format date as YYYY-MM-DD
     */
    function toISODate(dateStr) {
        const d = new Date(dateStr);
        return d.toISOString().split("T")[0];
    }

    /**
     * Get current month in YYYY-MM format
     */
    function getCurrentMonth() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }

    /**
     * Get month name from YYYY-MM string
     */
    function getMonthName(ym) {
        const [y, m] = ym.split("-");
        const d = new Date(parseInt(y), parseInt(m) - 1, 1);
        return d.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    }

    /**
     * Simple validation helpers
     */
    function isValidAmount(val) {
        const n = parseFloat(val);
        return !isNaN(n) && n > 0 && isFinite(n);
    }

    function isValidDate(val) {
        const d = new Date(val);
        return !isNaN(d.getTime());
    }

    function isNonEmpty(val) {
        return typeof val === "string" && val.trim().length > 0;
    }

    /**
     * Sanitize HTML to prevent XSS
     */
    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Debounce function
     */
    function debounce(fn, delay = 300) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * Get category icon
     */
    function getCategoryIcon(name) {
        const icons = {
            Food: "🍔",
            Transport: "🚗",
            Shopping: "🛍️",
            Bills: "📄",
            Entertainment: "🎬",
            Health: "💊",
            Other: "📦",
            Education: "📚",
            Travel: "✈️",
            Groceries: "🛒",
            Subscriptions: "📱",
            Clothing: "👕",
            Housing: "🏠",
            Utilities: "💡",
            Insurance: "🛡️",
            Savings: "🏦",
            Gifts: "🎁",
            Personal: "👤",
        };
        return icons[name] || "📦";
    }

    /**
     * Category colors
     */
    function getCategoryColor(name) {
        const colors = {
            Food: "#e17055",
            Transport: "#00b894",
            Shopping: "#6c5ce7",
            Bills: "#fdcb6e",
            Entertainment: "#e84393",
            Health: "#00cec9",
            Other: "#636e72",
            Education: "#0984e3",
            Travel: "#fd79a8",
            Groceries: "#55efc4",
            Subscriptions: "#a29bfe",
            Clothing: "#fab1a0",
            Housing: "#74b9ff",
            Utilities: "#ffeaa7",
            Insurance: "#dfe6e9",
            Savings: "#81ecec",
            Gifts: "#ff7675",
            Personal: "#b2bec3",
        };
        return colors[name] || "#636e72";
    }

    /**
     * Calculate percentage change
     */
    function percentChange(current, previous) {
        if (previous === 0) return current === 0 ? 0 : 100;
        return ((current - previous) / previous) * 100;
    }

    /**
     * Get last N months as YYYY-MM array
     */
    function getLastMonths(n = 6) {
        const months = [];
        const now = new Date();
        for (let i = n - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(
                `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
            );
        }
        return months;
    }

    /**
     * Convert array of expense objects to CSV string
     */
    function toCSV(expenses) {
        if (!expenses.length) return "";
        const headers = "ID,Amount,Category,Description,Date\n";
        const rows = expenses
            .map(
                (e) =>
                    `"${e.id}",${e.amount},"${(e.category || "").replace(/"/g, '""')}","${(e.description || "").replace(/"/g, '""')}","${e.date}"`,
            )
            .join("\n");
        return headers + rows;
    }

    /**
     * Download a file from string content
     */
    function downloadFile(content, filename, type = "text/plain") {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Read file as text (returns promise)
     */
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    /**
     * Today as YYYY-MM-DD
     */
    function today() {
        return new Date().toISOString().split("T")[0];
    }

    return {
        generateId,
        formatCurrency,
        formatDate,
        toISODate,
        getCurrentMonth,
        getMonthName,
        isValidAmount,
        isValidDate,
        isNonEmpty,
        escapeHtml,
        debounce,
        getCategoryIcon,
        getCategoryColor,
        percentChange,
        getLastMonths,
        toCSV,
        downloadFile,
        readFileAsText,
        today,
    };
})();
