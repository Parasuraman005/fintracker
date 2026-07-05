# FinTracker - Personal Finance Manager

FinTracker is a polished, modern personal finance management application built for precision and clarity. It empowers users to take full control of their financial life through an intuitive, data-driven interface.

## 🚀 Purpose & Features

FinTracker is designed to bridge the gap between complex accounting software and simple spreadsheets. Key features include:
- **Comprehensive Dashboard**: At-a-glance view of net balance, income, and expenses with interactive activity charts.
- **Multi-Wallet Support**: Manage multiple accounts (Bank, Cash, Digital) with real-time balance tracking and insufficient funds protection.
- **Smart Transactions**: Categorize every cent with support for custom categories and wallet-to-wallet transfers.
- **Advanced Reporting**: Deep-dive analytics including Category-Wise reports, Income/Expense breakdowns, and a dedicated Bills report with date filtering and search.
- **Bill Management**: Never miss a payment with tracking for paid, pending, and overdue obligations.
- **Responsive Design**: A seamless experience across desktop and mobile devices.

## 🏗️ File Structure

The project follows a modular, scalable architecture:

```text
/src
├── App.tsx             # Main application orchestrator & state manager
├── types.ts            # Global TypeScript interfaces (Transaction, Wallet, Bill, etc.)
├── mockData.ts         # Initial seed data for a rich first-run experience
├── index.css           # Tailwind CSS configuration and global typography
├── lib/
│   └── utils.ts        # Shared utility functions (e.g., cn for class merging)
└── components/         # Reusable UI modules & Page-level components
    ├── Dashboard.tsx   # Primary financial overview with Recharts
    ├── Sidebar.tsx     # Navigation & primary app controls
    ├── WalletsPage.tsx # Wallet creation and management
    ├── ReportsPage.tsx # Central hub for all financial analytics
    └── ...             # Feature-specific pages (Bills, Categories, Transactions)
```

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for utility-first responsive design
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (motion/react) for smooth, subtle transitions
- **Icons**: [Lucide React](https://lucide.dev/) for a consistent, modern icon set
- **Charts**: [Recharts](https://recharts.org/) for interactive financial visualizations
- **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast development and optimized production builds

## 🎨 Design System

### Typography
- **Primary Display**: `Outfit` — A geometric sans-serif that brings a tech-forward, premium feel to headings and display data.
- **UI & Body**: `Inter` — Highly legible and versatile for functional text and interface elements.

### Color Palette
The interface utilizes a sophisticated monochromatic base with purposeful high-contrast accents:
- **Neutral**: Zinc (Slate-adjacent) — Used for backgrounds (`bg-zinc-50` / `bg-zinc-950`) and borders to create depth and focus.
- **Success/Income**: `Emerald-600` — Represents financial growth and completed actions.
- **Danger/Expense**: `Rose-600` — Highlights outflows and overdue status.
- **Warning/Bills**: `Amber-500` — Signals pending obligations and cautionary states.
- **Brand Accents**: Indigo, Purple, and Blue are used to distinguish different categories and report types.

## 📖 Using FinTracker

1. **Setup Wallets**: Start by adding your active bank accounts or cash wallets.
2. **Log Transactions**: Record income and expenses daily. The app automatically protects you from spending more than a wallet contains.
3. **Analyze**: Use the Reports tab to see where your money goes. Toggle between "Income" and "Expense" in the Category Report to see a granular breakdown.
4. **Track Bills**: Use the Bills Report to search for specific obligations and filter by due dates to stay ahead of your payments.
