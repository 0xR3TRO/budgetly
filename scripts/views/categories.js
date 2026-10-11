/**
 * Budgetly — Categories View
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 */

const CategoriesView = (() => {
    function render() {
        const content = document.getElementById("content");
        const categories = Storage.getCategories();
        const settings = Storage.getSettings();
        const currentMonth = Utils.getCurrentMonth();
        const categoryTotals = Storage.getCategoryTotals(currentMonth);
        const allTimeTotals = Storage.getCategoryTotals();
        const expenses = Storage.getExpenses();

        content.innerHTML = `
      <div class="fade-in">
        <div class="toolbar">
          <div class="toolbar-left">
            <span style="color: var(--text-muted); font-size: 0.85rem;">${categories.length} categories</span>
          </div>
          <button class="btn btn-primary" id="btn-add-category">+ Add Category</button>
        </div>

        <div class="category-grid" id="category-grid">
          ${categories
              .map((c) => {
                  const monthTotal = categoryTotals[c.name] || 0;
                  const allTimeTotal = allTimeTotals[c.name] || 0;
                  const count = expenses.filter(
                      (e) => e.category === c.name,
                  ).length;
                  return `
              <div class="category-card" data-id="${c.id}">
                <div class="cat-icon" style="background: ${Utils.getCategoryColor(c.name)}20; color: ${Utils.getCategoryColor(c.name)};">
                  ${Utils.getCategoryIcon(c.name)}
                </div>
                <div class="cat-info">
                  <div class="cat-name">${Utils.escapeHtml(c.name)}</div>
                  <div class="cat-count">${count} expense${count !== 1 ? "s" : ""} • ${Utils.formatCurrency(monthTotal, settings.currency)} this month</div>
                </div>
                <div class="cat-actions">
                  <button class="btn btn-icon btn-secondary btn-sm" onclick="CategoriesView.renameCategory('${c.id}', '${Utils.escapeHtml(c.name)}')" title="Rename">✏️</button>
                  <button class="btn btn-icon btn-secondary btn-sm" onclick="CategoriesView.deleteCategory('${c.id}', '${Utils.escapeHtml(c.name)}')" title="Delete">🗑️</button>
                </div>
              </div>
            `;
              })
              .join("")}
        </div>

        <!-- Category breakdown chart -->
        <div class="card mt-3">
          <div class="card-header">
            <span class="card-title">Category Breakdown (All Time)</span>
          </div>
          <div class="chart-container" style="display:flex;justify-content:center;">
            <canvas id="category-pie-chart"></canvas>
          </div>
        </div>
      </div>
    `;

        document.getElementById("btn-add-category").onclick = () =>
            _openAddModal();

        requestAnimationFrame(() => {
            const canvas = document.getElementById("category-pie-chart");
            if (canvas) Charts.drawPieChart(canvas, allTimeTotals);
        });
    }

    function _openAddModal() {
        const body = document.createElement("div");
        body.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="cat-name">Category Name *</label>
        <input type="text" id="cat-name" class="form-control" placeholder="e.g., Subscriptions" maxlength="30" />
        <div class="form-error" id="err-cat-name">Category name is required and must be unique</div>
      </div>
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
        saveBtn.textContent = "Add Category";
        saveBtn.onclick = () => {
            const name = document.getElementById("cat-name").value.trim();
            if (!name || Storage.categoryExists(name)) {
                document
                    .getElementById("err-cat-name")
                    .classList.add("visible");
                document.getElementById("cat-name").classList.add("error");
                return;
            }
            Storage.addCategory(name);
            Toast.success(`Category "${name}" added!`);
            Modal.close();
            render();
        };

        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        Modal.open({ title: "Add New Category", body, footer });
        setTimeout(() => document.getElementById("cat-name")?.focus(), 100);
    }

    function renameCategory(id, currentName) {
        const body = document.createElement("div");
        body.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="cat-rename">New Name</label>
        <input type="text" id="cat-rename" class="form-control" value="${Utils.escapeHtml(currentName)}" maxlength="30" />
        <div class="form-error" id="err-cat-rename">Name is required and must be unique</div>
      </div>
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
        saveBtn.textContent = "Rename";
        saveBtn.onclick = () => {
            const newName = document.getElementById("cat-rename").value.trim();
            if (
                !newName ||
                (newName.toLowerCase() !== currentName.toLowerCase() &&
                    Storage.categoryExists(newName))
            ) {
                document
                    .getElementById("err-cat-rename")
                    .classList.add("visible");
                document.getElementById("cat-rename").classList.add("error");
                return;
            }
            Storage.renameCategory(id, newName);
            Toast.success(`Category renamed to "${newName}"!`);
            Modal.close();
            render();
        };

        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        Modal.open({ title: "Rename Category", body, footer });
        setTimeout(() => {
            const input = document.getElementById("cat-rename");
            if (input) {
                input.focus();
                input.select();
            }
        }, 100);
    }

    async function deleteCategory(id, name) {
        const count = Storage.getExpenses().filter(
            (e) => e.category === name,
        ).length;
        const message =
            count > 0
                ? `"${name}" has ${count} expense${count !== 1 ? "s" : ""}. They will be moved to "Other". Continue?`
                : `Delete category "${name}"?`;

        const confirmed = await Modal.confirm({
            title: "Delete Category",
            message,
            confirmText: "Delete",
            danger: true,
        });

        if (confirmed) {
            Storage.deleteCategory(id);
            Toast.success(`Category "${name}" deleted!`);
            render();
        }
    }

    return { render, renameCategory, deleteCategory };
})();
