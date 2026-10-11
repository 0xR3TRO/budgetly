# 💰 Budgetly — Browser-Based Expense Tracker

**Author:** [0xR3TRO](https://github.com/0xR3TRO)  
**Version:** 1.0.0  
**License:** MIT

---

## 📖 Description

**Budgetly** is a complete, production-ready browser-based expense tracking application built entirely with **pure HTML, CSS, and vanilla JavaScript** — no frameworks, no libraries. It runs 100% in the browser using LocalStorage for persistent data.

Designed to be clean, modern, and minimalistic — with full modular architecture ready for future backend integration.

---

## ✨ Features

### Core

- **Expense Management** — Add, edit, delete expenses with amount, category, date, description
- **Category System** — Default + custom categories; rename/delete with data migration
- **Dashboard & Analytics** — Monthly summary, spending by category, trend indicators
- **Canvas Charts** — Donut pie chart for categories, bar chart for monthly breakdown
- **Budget Tracking** — Set monthly budget, visual progress bar, overspend alerts
- **Full-Text Search** — Search across descriptions, categories, amounts, dates
- **Filter & Sort** — By date range, category, amount; sort by newest/oldest/highest/lowest

### UI/UX

- 🌙 **Dark/Light Mode** — Toggle saved in LocalStorage
- 📱 **Fully Responsive** — Mobile, tablet, desktop layouts
- 🔔 **Toast Notifications** — Visual feedback for all actions
- 🪟 **Modal Dialogs** — Confirm actions, edit forms
- ⌨️ **Keyboard Navigation** — Ctrl/Cmd+K to search
- ✨ **Smooth Animations** — CSS transitions throughout

### Data

- 💾 **Auto-Save** — All changes persisted automatically
- 📤 **Export JSON** — Full backup of all data
- 📊 **Export CSV** — Spreadsheet-compatible expense export
- 📥 **Import JSON** — Restore from backup file
- 🗑️ **Clear All Data** — Reset to defaults

### Settings

- Monthly budget amount
- Multi-currency support (USD, EUR, GBP, PLN, JPY, CHF)

---

## 📸 Screenshots

| Dashboard                                              | Expenses                                   | Categories                             | Settings                                      |
| ------------------------------------------------------ | ------------------------------------------ | -------------------------------------- | --------------------------------------------- |
| ![Dashboard](# "Dashboard view with charts and stats") | ![Expenses](# "Expense list with filters") | ![Categories](# "Category management") | ![Settings](# "App settings and data export") |

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Optionally: VS Code with **Live Server** extension

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/0xR3TRO/Budgetly.git
    cd Budgetly
    ```

2. **Open in browser:**
    - Simply open `index.html` in your browser, **or**
    - Use VS Code **Go Live** (Live Server) for development

No build steps. No `npm install`. No dependencies. Just open and use.

---

## 📁 Project Structure

```
Budgetly/
├── index.html              # Main HTML shell
├── README.md               # This file
├── styles/
│   └── styles.css          # Complete design system & responsive styles
└── scripts/
    ├── app.js              # Application entry point
    ├── router.js           # Hash-based SPA routing
    ├── storage.js          # LocalStorage data layer (CRUD, analytics)
    ├── charts.js           # Canvas-based chart rendering (pie, bar)
    ├── utils.js            # Helpers (formatting, validation, UUID, etc.)
    ├── components/
    │   ├── modal.js        # Modal dialog component
    │   ├── toast.js        # Toast notification component
    │   ├── dropdown.js     # Dropdown menu component
    │   └── tabs.js         # Tab switcher component
    └── views/
        ├── dashboard.js    # Dashboard view (stats, charts, recent)
        ├── expenses.js     # Expense list (CRUD, filter, sort)
        ├── categories.js   # Category management
        └── settings.js     # App settings, import/export, about
```

---

## 📐 Data Model

### Expense

```json
{
    "id": "uuid-v4",
    "amount": 42.5,
    "category": "Food",
    "description": "Lunch at cafe",
    "date": "2026-02-22"
}
```

### Category

```json
{
    "id": "cat_uuid",
    "name": "Transport"
}
```

### Settings

```json
{
    "theme": "dark",
    "monthlyBudget": 1500,
    "currency": "USD"
}
```

---

## 🛠️ Tech Stack

| Technology        | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| HTML5             | Semantic structure                                  |
| CSS3              | Custom design system, responsive layout, animations |
| Vanilla JS (ES6+) | All logic, routing, rendering                       |
| LocalStorage      | Persistent data storage                             |
| Canvas API        | Chart rendering (pie, bar)                          |

**Zero dependencies. Zero build tools. Zero frameworks.**

---

## 🗺️ Future Roadmap

- [ ] PWA (Service Worker for offline mode)
- [ ] IndexedDB support for larger datasets
- [ ] Recurring expenses
- [ ] Multi-currency conversion with live rates
- [ ] Password-less local encryption (AES)
- [ ] AI-powered category suggestions (local heuristic)
- [ ] Income tracking alongside expenses
- [ ] PDF report generation
- [ ] Drag-and-drop expense reordering
- [ ] Customizable dashboard widgets

---

## 👤 Author

**0xR3TRO**  
GitHub: [https://github.com/0xR3TRO](https://github.com/0xR3TRO)

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2026 0xR3TRO

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
