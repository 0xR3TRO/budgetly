/**
 * Budgetly — Settings View
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 */

const SettingsView = (() => {
    function render() {
        const content = document.getElementById("content");
        const settings = Storage.getSettings();

        content.innerHTML = `
      <div class="fade-in">
        <!-- Appearance -->
        <div class="card settings-section">
          <h3>🎨 Appearance</h3>
          <div class="setting-row">
            <div>
              <div class="setting-label">Dark Mode</div>
              <div class="setting-desc">Switch between light and dark theme</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="setting-theme" ${settings.theme === "dark" ? "checked" : ""} />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- Budget -->
        <div class="card settings-section">
          <h3>💰 Budget</h3>
          <div class="setting-row">
            <div>
              <div class="setting-label">Monthly Budget</div>
              <div class="setting-desc">Set your monthly spending limit</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="number" id="setting-budget" class="form-control" style="width: 140px;" value="${settings.monthlyBudget}" min="0" step="50" />
              <button class="btn btn-sm btn-primary" id="btn-save-budget">Save</button>
            </div>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Currency</div>
              <div class="setting-desc">Select your preferred currency</div>
            </div>
            <select id="setting-currency" class="form-control" style="width: 140px;">
              <option value="USD" ${settings.currency === "USD" ? "selected" : ""}>$ USD</option>
              <option value="EUR" ${settings.currency === "EUR" ? "selected" : ""}>€ EUR</option>
              <option value="GBP" ${settings.currency === "GBP" ? "selected" : ""}>£ GBP</option>
              <option value="PLN" ${settings.currency === "PLN" ? "selected" : ""}>zł PLN</option>
              <option value="JPY" ${settings.currency === "JPY" ? "selected" : ""}>¥ JPY</option>
              <option value="CHF" ${settings.currency === "CHF" ? "selected" : ""}>CHF</option>
            </select>
          </div>
        </div>

        <!-- Data Management -->
        <div class="card settings-section">
          <h3>📦 Data Management</h3>
          <div class="import-export-grid mb-2">
            <div class="import-export-card" id="export-json" tabindex="0">
              <div class="ie-icon">📤</div>
              <div class="ie-label">Export JSON</div>
              <div class="ie-desc">Download all data as JSON file</div>
            </div>
            <div class="import-export-card" id="export-csv" tabindex="0">
              <div class="ie-icon">📊</div>
              <div class="ie-label">Export CSV</div>
              <div class="ie-desc">Download expenses as CSV spreadsheet</div>
            </div>
            <div class="import-export-card" id="import-json" tabindex="0">
              <div class="ie-icon">📥</div>
              <div class="ie-label">Import JSON</div>
              <div class="ie-desc">Restore data from a JSON backup</div>
            </div>
            <div class="import-export-card" id="clear-data" tabindex="0" style="border-color: var(--danger);">
              <div class="ie-icon">🗑️</div>
              <div class="ie-label" style="color: var(--danger);">Clear All Data</div>
              <div class="ie-desc">Remove all expenses and reset to defaults</div>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="card settings-section">
          <h3>ℹ️ About</h3>
          <div class="setting-row">
            <div>
              <div class="setting-label">Budgetly</div>
              <div class="setting-desc">Version 1.0.0 — Pure HTML/CSS/JS Expense Tracker</div>
            </div>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Author</div>
              <div class="setting-desc">
                <a href="https://github.com/0xR3TRO" target="_blank" style="color: var(--accent);">0xR3TRO</a>
              </div>
            </div>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Repository</div>
              <div class="setting-desc">
                <a href="https://github.com/0xR3TRO/Budgetly" target="_blank" style="color: var(--accent);">github.com/0xR3TRO/Budgetly</a>
              </div>
            </div>
          </div>
          <div class="setting-row">
            <div>
              <div class="setting-label">License</div>
              <div class="setting-desc">MIT License</div>
            </div>
          </div>
        </div>
      </div>
    `;

        _bindEvents(settings);
    }

    function _bindEvents(settings) {
        // Theme toggle
        document.getElementById("setting-theme").onchange = (e) => {
            const theme = e.target.checked ? "dark" : "light";
            Storage.updateSettings({ theme });
            document.documentElement.setAttribute("data-theme", theme);
            document.getElementById("theme-toggle").textContent =
                theme === "dark" ? "☀️" : "🌙";
            Toast.info(`Switched to ${theme} mode`);
        };

        // Budget
        document.getElementById("btn-save-budget").onclick = () => {
            const val = parseFloat(
                document.getElementById("setting-budget").value,
            );
            if (isNaN(val) || val < 0) {
                Toast.error("Please enter a valid budget amount");
                return;
            }
            Storage.updateSettings({ monthlyBudget: val });
            Toast.success("Budget updated!");
        };

        // Currency
        document.getElementById("setting-currency").onchange = (e) => {
            Storage.updateSettings({ currency: e.target.value });
            Toast.success(`Currency changed to ${e.target.value}`);
        };

        // Export JSON
        document.getElementById("export-json").onclick = () => {
            const json = Storage.exportJSON();
            Utils.downloadFile(
                json,
                `budgetly-backup-${Utils.today()}.json`,
                "application/json",
            );
            Toast.success("Data exported as JSON!");
        };

        // Export CSV
        document.getElementById("export-csv").onclick = () => {
            const csv = Storage.exportCSV();
            if (!csv) {
                Toast.warning("No expenses to export");
                return;
            }
            Utils.downloadFile(
                csv,
                `budgetly-expenses-${Utils.today()}.csv`,
                "text/csv",
            );
            Toast.success("Expenses exported as CSV!");
        };

        // Import JSON
        document.getElementById("import-json").onclick = () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    const text = await Utils.readFileAsText(file);
                    const result = Storage.importData(text);
                    if (result.success) {
                        Toast.success(`Imported ${result.count} expenses!`);
                        render();
                    } else {
                        Toast.error(result.error || "Import failed");
                    }
                } catch (err) {
                    Toast.error("Failed to read file");
                }
            };
            input.click();
        };

        // Clear all data
        document.getElementById("clear-data").onclick = async () => {
            const confirmed = await Modal.confirm({
                title: "Clear All Data",
                message:
                    "This will permanently delete all your expenses, categories, and settings. This action cannot be undone!",
                confirmText: "Clear Everything",
                danger: true,
            });
            if (confirmed) {
                Storage.clearAll();
                Toast.info("All data has been cleared");
                render();
            }
        };
    }

    return { render };
})();
