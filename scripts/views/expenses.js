/**
 * Budgetly — Expenses View
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 */

const ExpensesView = (() => {
    let currentFilters = {
        category: "all",
        dateFrom: "",
        dateTo: "",
        amountMin: "",
        amountMax: "",
        search: "",
        sort: "newest",
    };

    function render() {
        const content = document.getElementById("content");
        const settings = Storage.getSettings();
        const categories = Storage.getCategories();

        content.innerHTML = `
      <div class="fade-in">
        <!-- Toolbar -->
        <div class="toolbar">
          <div class="toolbar-left">
            <select id="exp-filter-cat" class="form-control filter-select" style="width:auto;">
              <option value="all">All Categories</option>
              ${categories.map((c) => `<option value="${Utils.escapeHtml(c.name)}" ${currentFilters.category === c.name ? "selected" : ""}>${Utils.escapeHtml(c.name)}</option>`).join("")}
            </select>
            <select id="exp-sort" class="form-control filter-select" style="width:auto;">
              <option value="newest" ${currentFilters.sort === "newest" ? "selected" : ""}>Newest</option>
              <option value="oldest" ${currentFilters.sort === "oldest" ? "selected" : ""}>Oldest</option>
              <option value="highest" ${currentFilters.sort === "highest" ? "selected" : ""}>Highest</option>
              <option value="lowest" ${currentFilters.sort === "lowest" ? "selected" : ""}>Lowest</option>
            </select>
            <input type="date" id="exp-date-from" class="form-control filter-select" style="width:auto;" value="${currentFilters.dateFrom}" placeholder="From" title="Date from" />
            <input type="date" id="exp-date-to" class="form-control filter-select" style="width:auto;" value="${currentFilters.dateTo}" placeholder="To" title="Date to" />
          </div>
          <button class="btn btn-primary" id="btn-add-expense">+ Add Expense</button>
        </div>

        <!-- Expense List -->
        <div id="expense-list">
          <!-- rendered by _renderList -->
        </div>
      </div>
    `;

        // Bind events
        document.getElementById("exp-filter-cat").onchange = (e) => {
            currentFilters.category = e.target.value;
            _renderList();
        };
        document.getElementById("exp-sort").onchange = (e) => {
            currentFilters.sort = e.target.value;
            _renderList();
        };
        document.getElementById("exp-date-from").onchange = (e) => {
            currentFilters.dateFrom = e.target.value;
            _renderList();
        };
        document.getElementById("exp-date-to").onchange = (e) => {
            currentFilters.dateTo = e.target.value;
            _renderList();
        };
        document.getElementById("btn-add-expense").onclick = () =>
            _openExpenseModal();

        // Also handle global search
        const globalSearch = document.getElementById("global-search");
        if (globalSearch) {
            globalSearch.oninput = Utils.debounce((e) => {
                currentFilters.search = e.target.value;
                _renderList();
            }, 250);
        }

        _renderList();
    }

    function _renderList() {
        const container = document.getElementById("expense-list");
        if (!container) return;
        const settings = Storage.getSettings();
        const expenses = Storage.queryExpenses(currentFilters);

        if (expenses.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>No expenses found</h3>
          <p>Try adjusting your filters or add a new expense.</p>
        </div>
      `;
            return;
        }

        container.innerHTML = expenses
            .map(
                (e) => `
      <div class="expense-item" data-id="${e.id}">
        <div class="expense-icon" style="background: ${Utils.getCategoryColor(e.category)}20; color: ${Utils.getCategoryColor(e.category)};">
          ${Utils.getCategoryIcon(e.category)}
        </div>
        <div class="expense-info">
          <div class="expense-title">${Utils.escapeHtml(e.description || e.category)}</div>
          <div class="expense-meta">
            <span class="category-badge">${Utils.escapeHtml(e.category)}</span>
            <span>${Utils.formatDate(e.date)}</span>
          </div>
        </div>
        <div class="expense-amount">-${Utils.formatCurrency(e.amount, settings.currency)}</div>
        <div class="expense-actions">
          <button class="btn btn-icon btn-secondary" onclick="ExpensesView.editExpense('${e.id}')" title="Edit">✏️</button>
          <button class="btn btn-icon btn-secondary" onclick="ExpensesView.deleteExpense('${e.id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `,
            )
            .join("");
    }

    function _openExpenseModal(expense = null) {
        const isEdit = !!expense;
        const categories = Storage.getCategories();

        const body = document.createElement("div");
        body.innerHTML = `
      <form id="expense-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="exp-amount">Amount *</label>
            <input type="number" id="exp-amount" class="form-control" step="0.01" min="0.01" placeholder="0.00" value="${expense ? expense.amount : ""}" required />
            <div class="form-error" id="err-amount">Please enter a valid amount</div>
          </div>
          <div class="form-group">
            <label class="form-label" for="exp-category">Category *</label>
            <select id="exp-category" class="form-control" required>
              ${categories.map((c) => `<option value="${Utils.escapeHtml(c.name)}" ${expense && expense.category === c.name ? "selected" : ""}>${Utils.escapeHtml(c.name)}</option>`).join("")}
            </select>
            <div class="form-error" id="err-category">Please select a category</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="exp-date">Date *</label>
          <input type="date" id="exp-date" class="form-control" value="${expense ? expense.date : Utils.today()}" required />
          <div class="form-error" id="err-date">Please enter a valid date</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="exp-desc">Description</label>
          <textarea id="exp-desc" class="form-control" placeholder="What did you spend on?" rows="2">${expense ? Utils.escapeHtml(expense.description) : ""}</textarea>
        </div>
      </form>
    `;

        const footer = document.createElement("div");
        footer.style.display = "flex";
        footer.style.gap = "10px";
        footer.style.justifyContent = "flex-end";

        const cancelBtn = document.createElement("button");
        cancelBtn.className = "btn btn-secondary";
        cancelBtn.textContent = "Cancel";
        cancelBtn.onclick = () => Modal.close();

        const saveBtn = document.createElement("button");
        saveBtn.className = "btn btn-primary";
        saveBtn.textContent = isEdit ? "Update" : "Add Expense";
        saveBtn.onclick = () => _saveExpense(expense);

        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        Modal.open({
            title: isEdit ? "Edit Expense" : "Add New Expense",
            body,
            footer,
        });

        // Focus amount field
        setTimeout(() => {
            const amountField = document.getElementById("exp-amount");
            if (amountField) amountField.focus();
        }, 100);
    }

    function _saveExpense(existingExpense) {
        const amount = document.getElementById("exp-amount").value;
        const category = document.getElementById("exp-category").value;
        const date = document.getElementById("exp-date").value;
        const description = document.getElementById("exp-desc").value;

        // Validation
        let valid = true;

        if (!Utils.isValidAmount(amount)) {
            document.getElementById("err-amount").classList.add("visible");
            document.getElementById("exp-amount").classList.add("error");
            valid = false;
        } else {
            document.getElementById("err-amount").classList.remove("visible");
            document.getElementById("exp-amount").classList.remove("error");
        }

        if (!Utils.isValidDate(date)) {
            document.getElementById("err-date").classList.add("visible");
            document.getElementById("exp-date").classList.add("error");
            valid = false;
        } else {
            document.getElementById("err-date").classList.remove("visible");
            document.getElementById("exp-date").classList.remove("error");
        }

        if (!category) {
            document.getElementById("err-category").classList.add("visible");
            valid = false;
        } else {
            document.getElementById("err-category").classList.remove("visible");
        }

        if (!valid) return;

        if (existingExpense) {
            Storage.updateExpense(existingExpense.id, {
                amount,
                category,
                date,
                description,
            });
            Toast.success("Expense updated successfully!");
        } else {
            Storage.addExpense({ amount, category, date, description });
            Toast.success("Expense added successfully!");
        }

        Modal.close();
        _renderList();
    }

    function editExpense(id) {
        const expense = Storage.getExpenseById(id);
        if (expense) {
            _openExpenseModal(expense);
        }
    }

    async function deleteExpense(id) {
        const confirmed = await Modal.confirm({
            title: "Delete Expense",
            message:
                "Are you sure you want to delete this expense? This action cannot be undone.",
            confirmText: "Delete",
            danger: true,
        });
        if (confirmed) {
            Storage.deleteExpense(id);
            Toast.success("Expense deleted!");
            _renderList();
        }
    }

    /**
     * Called by global search
     */
    function setSearch(query) {
        currentFilters.search = query;
        _renderList();
    }

    return { render, editExpense, deleteExpense, setSearch };
})();
