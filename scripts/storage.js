/**
 * Budgetly — Storage Module (LocalStorage + IndexedDB support)
 * Author: 0xR3TRO (https://github.com/0xR3TRO)
 */

const Storage = (() => {
    const KEYS = {
        EXPENSES: "budgetly_expenses",
        CATEGORIES: "budgetly_categories",
        SETTINGS: "budgetly_settings",
    };

    const DEFAULT_CATEGORIES = [
        { id: "cat_food", name: "Food" },
        { id: "cat_transport", name: "Transport" },
        { id: "cat_shopping", name: "Shopping" },
        { id: "cat_bills", name: "Bills" },
        { id: "cat_entertainment", name: "Entertainment" },
        { id: "cat_health", name: "Health" },
        { id: "cat_education", name: "Education" },
        { id: "cat_other", name: "Other" },
    ];

    const DEFAULT_SETTINGS = {
        theme: "light",
        monthlyBudget: 1500,
        currency: "USD",
    };

    // ===== LocalStorage Helpers =====
    function _get(key) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.error("Storage read error:", e);
            return null;
        }
    }

    function _set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error("Storage write error:", e);
            return false;
        }
    }

    // ===== Init =====
    function init() {
        if (!_get(KEYS.CATEGORIES)) {
            _set(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
        }
        if (!_get(KEYS.SETTINGS)) {
            _set(KEYS.SETTINGS, DEFAULT_SETTINGS);
        }
        if (!_get(KEYS.EXPENSES)) {
            _set(KEYS.EXPENSES, []);
        }
    }

    // ===== Expenses =====
    function getExpenses() {
        return _get(KEYS.EXPENSES) || [];
    }

    function addExpense(expense) {
        const expenses = getExpenses();
        const newExpense = {
            id: Utils.generateId(),
            amount: parseFloat(expense.amount),
            category: expense.category,
            description: expense.description || "",
            date: expense.date || Utils.today(),
        };
        expenses.unshift(newExpense);
        _set(KEYS.EXPENSES, expenses);
        return newExpense;
    }

    function updateExpense(id, updates) {
        const expenses = getExpenses();
        const idx = expenses.findIndex((e) => e.id === id);
        if (idx === -1) return null;
        if (updates.amount !== undefined)
            updates.amount = parseFloat(updates.amount);
        expenses[idx] = { ...expenses[idx], ...updates };
        _set(KEYS.EXPENSES, expenses);
        return expenses[idx];
    }

    function deleteExpense(id) {
        const expenses = getExpenses();
        const filtered = expenses.filter((e) => e.id !== id);
        _set(KEYS.EXPENSES, filtered);
        return filtered.length < expenses.length;
    }

    function getExpenseById(id) {
        return getExpenses().find((e) => e.id === id) || null;
    }

    /**
     * Filter / sort expenses
     */
    function queryExpenses({
        category,
        dateFrom,
        dateTo,
        amountMin,
        amountMax,
        search,
        sort,
    } = {}) {
        let list = getExpenses();

        if (category && category !== "all") {
            list = list.filter((e) => e.category === category);
        }
        if (dateFrom) {
            list = list.filter((e) => e.date >= dateFrom);
        }
        if (dateTo) {
            list = list.filter((e) => e.date <= dateTo);
        }
        if (amountMin !== undefined && amountMin !== "") {
            list = list.filter((e) => e.amount >= parseFloat(amountMin));
        }
        if (amountMax !== undefined && amountMax !== "") {
            list = list.filter((e) => e.amount <= parseFloat(amountMax));
        }
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(
                (e) =>
                    (e.description &&
                        e.description.toLowerCase().includes(q)) ||
                    (e.category && e.category.toLowerCase().includes(q)) ||
                    String(e.amount).includes(q) ||
                    (e.date && e.date.includes(q)),
            );
        }

        switch (sort) {
            case "newest":
                list.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "oldest":
                list.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "highest":
                list.sort((a, b) => b.amount - a.amount);
                break;
            case "lowest":
                list.sort((a, b) => a.amount - b.amount);
                break;
            default:
                list.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        return list;
    }

    // ===== Categories =====
    function getCategories() {
        return _get(KEYS.CATEGORIES) || DEFAULT_CATEGORIES;
    }

    function addCategory(name) {
        const categories = getCategories();
        if (
            categories.some((c) => c.name.toLowerCase() === name.toLowerCase())
        ) {
            return null; // duplicate
        }
        const newCat = {
            id: "cat_" + Utils.generateId().substring(0, 8),
            name: name.trim(),
        };
        categories.push(newCat);
        _set(KEYS.CATEGORIES, categories);
        return newCat;
    }

    function renameCategory(id, newName) {
        const categories = getCategories();
        const idx = categories.findIndex((c) => c.id === id);
        if (idx === -1) return null;
        const oldName = categories[idx].name;
        categories[idx].name = newName.trim();
        _set(KEYS.CATEGORIES, categories);

        // Update all expenses with old category name
        const expenses = getExpenses();
        let changed = false;
        expenses.forEach((e) => {
            if (e.category === oldName) {
                e.category = newName.trim();
                changed = true;
            }
        });
        if (changed) _set(KEYS.EXPENSES, expenses);

        return categories[idx];
    }

    function deleteCategory(id) {
        const categories = getCategories();
        const cat = categories.find((c) => c.id === id);
        if (!cat) return false;
        const filtered = categories.filter((c) => c.id !== id);
        _set(KEYS.CATEGORIES, filtered);

        // Move orphaned expenses to "Other"
        const expenses = getExpenses();
        let changed = false;
        expenses.forEach((e) => {
            if (e.category === cat.name) {
                e.category = "Other";
                changed = true;
            }
        });
        if (changed) _set(KEYS.EXPENSES, expenses);

        return true;
    }

    function categoryExists(name) {
        return getCategories().some(
            (c) => c.name.toLowerCase() === name.toLowerCase(),
        );
    }

    // ===== Settings =====
    function getSettings() {
        return { ...DEFAULT_SETTINGS, ...(_get(KEYS.SETTINGS) || {}) };
    }

    function updateSettings(updates) {
        const settings = getSettings();
        const merged = { ...settings, ...updates };
        _set(KEYS.SETTINGS, merged);
        return merged;
    }

    // ===== Analytics =====
    function getMonthlyTotal(yearMonth) {
        const expenses = getExpenses();
        return expenses
            .filter((e) => e.date && e.date.startsWith(yearMonth))
            .reduce((sum, e) => sum + e.amount, 0);
    }

    function getCategoryTotals(yearMonth) {
        const expenses = getExpenses();
        const filtered = yearMonth
            ? expenses.filter((e) => e.date && e.date.startsWith(yearMonth))
            : expenses;
        const totals = {};
        filtered.forEach((e) => {
            totals[e.category] = (totals[e.category] || 0) + e.amount;
        });
        return totals;
    }

    function getMonthlyBreakdown(months) {
        const result = {};
        months.forEach((m) => {
            result[m] = getMonthlyTotal(m);
        });
        return result;
    }

    function getTotalExpenses() {
        return getExpenses().reduce((sum, e) => sum + e.amount, 0);
    }

    function getExpenseCount() {
        return getExpenses().length;
    }

    function getRecentExpenses(n = 5) {
        return getExpenses()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, n);
    }

    // ===== Import / Export =====
    function exportJSON() {
        return JSON.stringify(
            {
                expenses: getExpenses(),
                categories: getCategories(),
                settings: getSettings(),
                exportedAt: new Date().toISOString(),
                author: "0xR3TRO",
                app: "Budgetly",
            },
            null,
            2,
        );
    }

    function exportCSV() {
        return Utils.toCSV(getExpenses());
    }

    function importData(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            if (data.expenses && Array.isArray(data.expenses)) {
                // Validate each expense
                const valid = data.expenses.every(
                    (e) => e.id && Utils.isValidAmount(e.amount) && e.date,
                );
                if (!valid)
                    return {
                        success: false,
                        error: "Invalid expense data in file",
                    };
                _set(KEYS.EXPENSES, data.expenses);
            }
            if (data.categories && Array.isArray(data.categories)) {
                _set(KEYS.CATEGORIES, data.categories);
            }
            if (data.settings && typeof data.settings === "object") {
                _set(KEYS.SETTINGS, { ...DEFAULT_SETTINGS, ...data.settings });
            }
            return { success: true, count: (data.expenses || []).length };
        } catch (e) {
            return { success: false, error: "Invalid JSON file" };
        }
    }

    function clearAll() {
        _set(KEYS.EXPENSES, []);
        _set(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
        _set(KEYS.SETTINGS, DEFAULT_SETTINGS);
    }

    return {
        init,
        getExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpenseById,
        queryExpenses,
        getCategories,
        addCategory,
        renameCategory,
        deleteCategory,
        categoryExists,
        getSettings,
        updateSettings,
        getMonthlyTotal,
        getCategoryTotals,
        getMonthlyBreakdown,
        getTotalExpenses,
        getExpenseCount,
        getRecentExpenses,
        exportJSON,
        exportCSV,
        importData,
        clearAll,
    };
})();
