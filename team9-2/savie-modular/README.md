# SmartSave - Modular React Application

A modern, modular React application for personal finance management with grocery and fuel price comparison.

## 📁 Project Structure

```
savie-modular/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BottomNav/
│   │   │   ├── BottomNav.jsx
│   │   │   └── BottomNav.css
│   │   ├── BrandBadge/
│   │   │   ├── BrandBadge.jsx
│   │   │   └── BrandBadge.css
│   │   ├── ChatWidget/
│   │   │   ├── ChatWidget.jsx
│   │   │   └── ChatWidget.css
│   │   ├── InsightPopup/
│   │   │   ├── InsightPopup.jsx
│   │   │   └── InsightPopup.css
│   │   └── ProgressBar/
│   │       ├── ProgressBar.jsx
│   │       └── ProgressBar.css
│   │
│   ├── pages/               # Main page components
│   │   ├── Onboarding/
│   │   │   ├── Onboarding.jsx
│   │   │   └── Onboarding.css
│   │   ├── FinancialOverview/
│   │   │   ├── FinancialOverview.jsx
│   │   │   └── FinancialOverview.css
│   │   ├── FuelPrices/
│   │   │   ├── FuelPrices.jsx
│   │   │   └── FuelPrices.css
│   │   └── GroceryComparison/
│   │       ├── GroceryComparison.jsx
│   │       └── GroceryComparison.css
│   │
│   ├── utils/               # Utility functions and data
│   │   ├── session.js       # Session management
│   │   └── mockData.js      # Mock data and helpers
│   │
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global app styles
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
│
├── package.json
└── README.md
```

## 🎨 Components

### Core Components

**BottomNav** - Bottom navigation bar with three sections (Overview, Fuel, Groceries)
**ChatWidget** - Floating chat assistant with FAB button
**InsightPopup** - Modal popup for displaying initial financial insights
**ProgressBar** - Progress indicator for onboarding questions
**BrandBadge** - Colored badge for fuel station brands

### Pages

**Onboarding** - 5-step questionnaire for user data collection
**FinancialOverview** - Main dashboard with spending breakdown
**FuelPrices** - Fuel price comparison with rewards tracking
**GroceryComparison** - Grocery price search and comparison

## 🚀 Getting Started

### Installation

```bash
cd savie-modular
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/savie
```

### Development

```bash
npm start
```

Runs the app at [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

## 📦 Features

### Onboarding Flow
- Financial goal selection (budgeting/saving)
- Age input
- Income slider ($20k - $200k)
- Postcode entry
- Bank connection (demo data)
- Optional savings goal

### Financial Overview
- Category-based spending breakdown
- Budget tracking with progress bars
- Over/under budget indicators
- Quick actions for fuel and grocery comparison
- Actionable insights per category

### Fuel Prices
- Multiple fuel types (U91, P95, P98, E10, Diesel, LPG)
- Station sorting by price
- Partnership rewards tracking (7-Eleven, Coles Express)
- Progress bar for gift card rewards

### Grocery Comparison
- Real-time search functionality
- Side-by-side price comparison (Coles vs Woolworths)
- Best price highlighting
- Savings calculation

### Chat Assistant
- Floating action button
- Slide-up panel interface
- Typing indicators
- Message history

## 🔧 Utility Functions

### Session Management (`utils/session.js`)
- `getSessionId()` - Generate or retrieve session ID from localStorage
- `clearSession()` - Clear session data

### Mock Data (`utils/mockData.js`)
- Transaction data
- Fuel stations and prices
- Grocery items
- Helper functions for data processing

## 🎯 N8N Integration

The app sends data to N8N webhook in the following format:

```json
{
  "sessionId": "session_1739123456_abc123",
  "financialGoal": "budgeting",
  "age": 28,
  "income": 75000,
  "postcode": "3000",
  "bank": "commbank",
  "goal": "buy a car",
  "transactions": [...]
}
```

## 🎨 Styling

- Uses CSS Modules pattern (component-scoped styles)
- Google Fonts: Outfit (main) and DM Mono (prices)
- Custom animations: fadeInUp, chatSlideUp, typingDot
- Responsive design with mobile-first approach
- Color scheme: Green (#16a34a) primary, Blue (#0ea5e9) accent

## 📱 Mobile Optimized

- Touch-friendly interface
- Bottom navigation for easy thumb access
- Responsive layouts
- Optimized for iOS and Android

## 🔐 Privacy & Security

- Session IDs stored in localStorage
- No sensitive data in localStorage
- Demo bank data only (no real banking integration)

## 🚧 Future Enhancements

- [ ] Real API integration for live pricing
- [ ] User authentication
- [ ] Data persistence
- [ ] Advanced analytics
- [ ] Export reports
- [ ] Push notifications

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md for guidelines.

---

Built with ❤️ for Australian shoppers
