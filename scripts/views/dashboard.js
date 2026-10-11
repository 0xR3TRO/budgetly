/**
 * Budgetly — Dashboard View
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 */

const DashboardView = (() => {
    function render() {
        const content = document.getElementById("content");
        const settings = Storage.getSettings();
        const currentMonth = Utils.getCurrentMonth();
        const monthlySpent = Storage.getMonthlyTotal(currentMonth);
        const budget = settings.monthlyBudget;
        const budgetPct =
            budget > 0 ? Math.min((monthlySpent / budget) * 100, 100) : 0;
        const totalExpenses = Storage.getTotalExpenses();
        const expenseCount = Storage.getExpenseCount();
        const categoryTotals = Storage.getCategoryTotals(currentMonth);
        const months = Utils.getLastMonths(6);
        const monthlyBreakdown = Storage.getMonthlyBreakdown(months);

        // Previous month comparison
        const prevMonth = months[months.length - 2];
        const prevMonthTotal = Storage.getMonthlyTotal(prevMonth);
        const pctChange = Utils.percentChange(monthlySpent, prevMonthTotal);
        const trendClass =
            pctChange > 0 ? "up" : pctChange < 0 ? "down" : "neutral";
        const trendArrow = pctChange > 0 ? "↑" : pctChange < 0 ? "↓" : "→";

        // Budget warning class
        let budgetBarClass = "";
        if (budgetPct >= 90) budgetBarClass = "danger";
        else if (budgetPct >= 70) budgetBarClass = "warning";

        // Budget warning toast
        if (budgetPct >= 100) {
            setTimeout(
                () =>
                    Toast.warning(
                        `You've exceeded your monthly budget of ${Utils.formatCurrency(budget, settings.currency)}!`,
                    ),
                500,
            );
        } else if (budgetPct >= 90) {
            setTimeout(
                () =>
                    Toast.warning(
                        `You're at ${budgetPct.toFixed(0)}% of your monthly budget!`,
                    ),
                500,
            );
        }

        const recentExpenses = Storage.getRecentExpenses(5);

        content.innerHTML = `
      <div class="fade-in">
        <!-- Budget Progress -->
        <div class="budget-section">
          <div class="card">
            <div class="budget-header">
              <div>
                <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Monthly Budget — ${Utils.getMonthName(currentMonth)}</div>
                <div class="budget-info">
                  <span class="budget-spent">${Utils.formatCurrency(monthlySpent, settings.currency)}</span>
                  <span class="budget-total">/ ${Utils.formatCurrency(budget, settings.currency)}</span>
                </div>
              </div>
              <span class="budget-percentage" style="color: ${budgetPct >= 90 ? "var(--danger)" : budgetPct >= 70 ? "var(--warning)" : "var(--accent)"};">
                ${budgetPct.toFixed(0)}%
              </span>
            </div>
            <div class="progress-bar mt-1">
              <div class="progress-fill ${budgetBarClass}" style="width: ${budgetPct}%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 8px;">
              <small style="color: var(--text-muted);">Remaining: ${Utils.formatCurrency(Math.max(budget - monthlySpent, 0), settings.currency)}</small>
              <small style="color: var(--text-muted);">${budget > 0 ? Math.ceil((budget - monthlySpent) / (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate() + 1)) : 0} ${settings.currency}/day left</small>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">This Month</span>
            <span class="stat-value">${Utils.formatCurrency(monthlySpent, settings.currency)}</span>
            <span class="stat-trend ${trendClass}">
              ${trendArrow} ${Math.abs(pctChange).toFixed(1)}% vs last month
            </span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Total All Time</span>
            <span class="stat-value">${Utils.formatCurrency(totalExpenses, settings.currency)}</span>
            <span class="stat-trend neutral">${expenseCount} expenses tracked</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Top Category</span>
            <span class="stat-value">${_topCategory(categoryTotals)}</span>
            <span class="stat-trend neutral">${Utils.formatCurrency(_topCategoryAmount(categoryTotals), settings.currency)}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Daily Average</span>
            <span class="stat-value">${Utils.formatCurrency(_dailyAverage(monthlySpent), settings.currency)}</span>
            <span class="stat-trend neutral">this month</span>
          </div>
        </div>

        <!-- Charts -->
        <div class="charts-grid">
          <div class="card">
            <div class="card-header">
              <span class="card-title">Spending by Category</span>
            </div>
            <div class="chart-container" style="display:flex;justify-content:center;">
              <canvas id="pie-chart"></canvas>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <span class="card-title">Monthly Spending (Last 6 Months)</span>
            </div>
            <div class="chart-container">
              <canvas id="bar-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Recent Expenses -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Recent Expenses</span>
            <button class="btn btn-sm btn-secondary" onclick="Router.navigate('expenses')">View All →</button>
          </div>
          <div class="recent-list" id="recent-list">
            ${
                recentExpenses.length === 0
                    ? '<div class="empty-state"><div class="empty-icon">📭</div><h3>No expenses yet</h3><p>Add your first expense to start tracking!</p></div>'
                    : recentExpenses
                          .map((e) => _renderExpenseItem(e, settings))
                          .join("")
            }
          </div>
        </div>
      </div>
    `;

        // Draw charts after DOM is ready
        requestAnimationFrame(() => {
            const pieCanvas = document.getElementById("pie-chart");
            const barCanvas = document.getElementById("bar-chart");
            if (pieCanvas) Charts.drawPieChart(pieCanvas, categoryTotals);
            if (barCanvas) Charts.drawBarChart(barCanvas, monthlyBreakdown);
        });
    }

    function _topCategory(totals) {
        const entries = Object.entries(totals);
        if (!entries.length) return "—";
        entries.sort((a, b) => b[1] - a[1]);
        return entries[0][0];
    }

    function _topCategoryAmount(totals) {
        const entries = Object.entries(totals);
        if (!entries.length) return 0;
        entries.sort((a, b) => b[1] - a[1]);
        return entries[0][1];
    }

    function _dailyAverage(monthlySpent) {
        const day = new Date().getDate();
        return day > 0 ? monthlySpent / day : 0;
    }

    function _renderExpenseItem(e, settings) {
        return `
      <div class="expense-item">
        <div class="expense-icon" style="background: ${Utils.getCategoryColor(e.category)}20; color: ${Utils.getCategoryColor(e.category)};">
          ${Utils.getCategoryIcon(e.category)}
        </div>
        <div class="expense-info">
          <div class="expense-title">${Utils.escapeHtml(e.description || e.category)}</div>
          <div class="expense-meta">
            <span>${Utils.escapeHtml(e.category)}</span>
            <span>•</span>
            <span>${Utils.formatDate(e.date)}</span>
          </div>
        </div>
        <div class="expense-amount">-${Utils.formatCurrency(e.amount, settings.currency)}</div>
      </div>
    `;
    }

    return { render };
})();
