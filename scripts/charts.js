/**
 * Budgetly — Charts Module (Canvas-based)
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 * Pure vanilla JS canvas drawing — no Chart.js
 */

const Charts = (() => {
    const COLORS = [
        "#6c5ce7",
        "#e17055",
        "#00b894",
        "#fdcb6e",
        "#e84393",
        "#00cec9",
        "#0984e3",
        "#636e72",
        "#fd79a8",
        "#55efc4",
        "#a29bfe",
        "#fab1a0",
        "#74b9ff",
        "#ffeaa7",
        "#dfe6e9",
        "#81ecec",
        "#ff7675",
        "#b2bec3",
    ];

    /**
     * Draw a pie chart
     * @param {HTMLCanvasElement} canvas
     * @param {Object} data - { label: value }
     */
    function drawPieChart(canvas, data, title = "") {
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        const size = Math.min(rect.width, 360);

        canvas.width = size * dpr;
        canvas.height = (size + 40) * dpr;
        canvas.style.width = size + "px";
        canvas.style.height = size + 40 + "px";
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, size, size + 40);

        const entries = Object.entries(data).filter(([, v]) => v > 0);
        const total = entries.reduce((s, [, v]) => s + v, 0);

        if (total === 0) {
            ctx.fillStyle =
                getComputedStyle(document.documentElement)
                    .getPropertyValue("--text-muted")
                    .trim() || "#9ca3af";
            ctx.font = '14px "Segoe UI", sans-serif';
            ctx.textAlign = "center";
            ctx.fillText("No data to display", size / 2, size / 2);
            return;
        }

        const cx = size / 2;
        const cy = size / 2 - 10;
        const radius = Math.min(cx, cy) - 50;
        let startAngle = -Math.PI / 2;

        // Draw slices
        entries.forEach(([label, value], i) => {
            const sliceAngle = (value / total) * (2 * Math.PI);
            const endAngle = startAngle + sliceAngle;

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = COLORS[i % COLORS.length];
            ctx.fill();

            // Label on slice
            if (sliceAngle > 0.3) {
                const midAngle = startAngle + sliceAngle / 2;
                const lx = cx + Math.cos(midAngle) * (radius * 0.65);
                const ly = cy + Math.sin(midAngle) * (radius * 0.65);
                ctx.fillStyle = "#fff";
                ctx.font = 'bold 11px "Segoe UI", sans-serif';
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const pct = ((value / total) * 100).toFixed(0) + "%";
                ctx.fillText(pct, lx, ly);
            }

            startAngle = endAngle;
        });

        // Center hole (donut)
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.45, 0, 2 * Math.PI);
        const bgColor =
            getComputedStyle(document.documentElement)
                .getPropertyValue("--bg-card")
                .trim() || "#fff";
        ctx.fillStyle = bgColor;
        ctx.fill();

        // Center text
        const textColor =
            getComputedStyle(document.documentElement)
                .getPropertyValue("--text-primary")
                .trim() || "#1e1e2f";
        ctx.fillStyle = textColor;
        ctx.font = 'bold 16px "Segoe UI", sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const settings = Storage.getSettings();
        ctx.fillText(
            Utils.formatCurrency(total, settings.currency),
            cx,
            cy - 6,
        );
        ctx.font = '11px "Segoe UI", sans-serif';
        ctx.fillStyle =
            getComputedStyle(document.documentElement)
                .getPropertyValue("--text-muted")
                .trim() || "#9ca3af";
        ctx.fillText("Total", cx, cy + 12);

        // Legend below
        const legendY = size - 30;
        const legendEntries = entries.slice(0, 8);
        const lw = size / legendEntries.length;
        ctx.font = '10px "Segoe UI", sans-serif';
        ctx.textBaseline = "top";

        // Draw legend in rows
        const legendStartX = 10;
        const colWidth = 90;
        const cols = Math.floor((size - 20) / colWidth);
        legendEntries.forEach(([label], i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = legendStartX + col * colWidth;
            const y = legendY + row * 16;

            ctx.fillStyle = COLORS[i % COLORS.length];
            ctx.fillRect(x, y + 2, 8, 8);
            ctx.fillStyle = textColor;
            ctx.textAlign = "left";
            const displayLabel =
                label.length > 9 ? label.substring(0, 8) + "…" : label;
            ctx.fillText(displayLabel, x + 12, y);
        });
    }

    /**
     * Draw a bar chart
     * @param {HTMLCanvasElement} canvas
     * @param {Object} data - { label: value }
     */
    function drawBarChart(canvas, data, title = "") {
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        const width = rect.width;
        const height = 280;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, width, height);

        const entries = Object.entries(data);
        const values = entries.map(([, v]) => v);
        const maxVal = Math.max(...values, 1);

        const padding = { top: 20, right: 20, bottom: 50, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        const barWidth = Math.min((chartWidth / entries.length) * 0.6, 50);
        const gap = chartWidth / entries.length;

        const textColor =
            getComputedStyle(document.documentElement)
                .getPropertyValue("--text-primary")
                .trim() || "#1e1e2f";
        const mutedColor =
            getComputedStyle(document.documentElement)
                .getPropertyValue("--text-muted")
                .trim() || "#9ca3af";
        const borderColor =
            getComputedStyle(document.documentElement)
                .getPropertyValue("--border")
                .trim() || "#e5e7eb";

        // Grid lines
        const gridLines = 5;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 0.5;
        ctx.font = '11px "Segoe UI", sans-serif';
        ctx.fillStyle = mutedColor;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (chartHeight / gridLines) * i;
            const val = maxVal - (maxVal / gridLines) * i;

            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            const settings = Storage.getSettings();
            ctx.fillText(
                Utils.formatCurrency(val, settings.currency),
                padding.left - 8,
                y,
            );
        }

        // Bars
        entries.forEach(([label, value], i) => {
            const x = padding.left + gap * i + (gap - barWidth) / 2;
            const barHeight = (value / maxVal) * chartHeight;
            const y = padding.top + chartHeight - barHeight;

            // Gradient bar
            const gradient = ctx.createLinearGradient(
                x,
                y,
                x,
                padding.top + chartHeight,
            );
            gradient.addColorStop(0, "#6c5ce7");
            gradient.addColorStop(1, "#a29bfe");
            ctx.fillStyle = gradient;

            // Rounded top
            const r = Math.min(barWidth / 2, 6);
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + barWidth - r, y);
            ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
            ctx.lineTo(x + barWidth, padding.top + chartHeight);
            ctx.lineTo(x, padding.top + chartHeight);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.fill();

            // Value on top
            if (value > 0) {
                ctx.fillStyle = textColor;
                ctx.font = 'bold 10px "Segoe UI", sans-serif';
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                const settings = Storage.getSettings();
                ctx.fillText(
                    Utils.formatCurrency(value, settings.currency),
                    x + barWidth / 2,
                    y - 4,
                );
            }

            // Label below
            ctx.fillStyle = mutedColor;
            ctx.font = '10px "Segoe UI", sans-serif';
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            // Convert YYYY-MM to short month name
            const parts = label.split("-");
            let displayLabel = label;
            if (parts.length === 2) {
                const d = new Date(
                    parseInt(parts[0]),
                    parseInt(parts[1]) - 1,
                    1,
                );
                displayLabel = d.toLocaleDateString("en-US", {
                    month: "short",
                });
            }
            ctx.fillText(
                displayLabel,
                x + barWidth / 2,
                padding.top + chartHeight + 8,
            );
        });
    }

    /**
     * Draw a mini sparkline (for stat cards)
     */
    function drawSparkline(canvas, values, color = "#6c5ce7") {
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        if (values.length < 2) return;

        const max = Math.max(...values, 1);
        const min = Math.min(...values, 0);
        const range = max - min || 1;
        const step = w / (values.length - 1);
        const pad = 2;

        ctx.beginPath();
        values.forEach((v, i) => {
            const x = i * step;
            const y = pad + (1 - (v - min) / range) * (h - pad * 2);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.stroke();

        // Fill area under
        ctx.lineTo((values.length - 1) * step, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = color + "20";
        ctx.fill();
    }

    return {
        drawPieChart,
        drawBarChart,
        drawSparkline,
        COLORS,
    };
})();
