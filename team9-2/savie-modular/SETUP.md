# SmartSave Setup Guide

## 🚀 Quick Start (3 steps)

### Step 1: Extract and Install

```bash
# Extract the project
cd ~/Desktop
cp -r /path/to/savie-modular .

# Navigate to project
cd savie-modular

# Install dependencies
npm install
```

### Step 2: Configure Environment (Optional)

Create a `.env` file in the root directory:

```bash
REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/savie
```

**Note:** The app works with mock data without this configuration.

### Step 3: Run the App

```bash
npm start
```

The app will open at **http://localhost:3000**

---

## 📁 Project Structure Explained

```
savie-modular/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BottomNav/       # Bottom navigation bar
│   │   ├── BrandBadge/      # Fuel station brand indicators
│   │   ├── ChatWidget/      # Chat assistant
│   │   ├── InsightPopup/    # Initial insight modal
│   │   └── ProgressBar/     # Onboarding progress
│   │
│   ├── pages/               # Main application pages
│   │   ├── Onboarding/      # 5-step questionnaire
│   │   ├── FinancialOverview/ # Dashboard with spending
│   │   ├── FuelPrices/      # Fuel comparison & rewards
│   │   └── GroceryComparison/ # Grocery search & compare
│   │
│   ├── utils/               # Helper functions
│   │   ├── session.js       # Session management
│   │   └── mockData.js      # Mock data & helpers
│   │
│   ├── App.jsx              # Main app logic
│   └── index.js             # Entry point
```

---

## 🎯 Component Overview

### 1. **App.jsx** (Main Container)
- Manages global state
- Handles page routing
- Coordinates data flow between pages

### 2. **Onboarding/** 
- 5-step questionnaire
- Progress tracking
- Form validation
- N8N webhook submission

### 3. **FinancialOverview/**
- Spending breakdown by category
- Budget tracking with progress bars
- Quick action buttons
- Category insights

### 4. **FuelPrices/**
- Fuel type selector (U91, P95, P98, etc.)
- Sorted station list
- Partnership rewards (7-Eleven, Coles)
- Gift card progress tracking

### 5. **GroceryComparison/**
- Real-time search
- Price comparison (Coles vs Woolworths)
- Best price highlighting
- Savings calculation

### 6. **ChatWidget/**
- Floating action button
- Slide-up chat panel
- Message history
- Typing indicators

---

## 🛠️ Customization Guide

### Change Colors

Edit the CSS files in each component folder:

```css
/* Primary green */
#16a34a

/* Accent blue */
#0ea5e9

/* Error red */
#ef4444
```

### Add New Page

1. Create folder: `src/pages/NewPage/`
2. Add files: `NewPage.jsx` and `NewPage.css`
3. Import in `App.jsx`:
   ```jsx
   import NewPage from './pages/NewPage/NewPage';
   ```
4. Add route in App.jsx

### Modify Mock Data

Edit `src/utils/mockData.js`:

```javascript
export const MOCK_TRANSACTIONS = [
  // Add your transactions
];

export const MOCK_GROCERY_ITEMS = [
  // Add your items
];
```

---

## 🔌 N8N Integration

### Payload Format

The app sends this JSON to your N8N webhook:

```json
{
  "sessionId": "session_1739123456_abc123",
  "financialGoal": "budgeting",
  "age": 28,
  "income": 75000,
  "postcode": "3000",
  "bank": "commbank",
  "goal": "buy a car",
  "transactions": [
    {
      "date": "2025-02-10",
      "description": "Woolworths",
      "category": "Groceries",
      "amount": -127.45
    }
  ]
}
```

### Expected Response

```json
{
  "initialInsight": "Your grocery spending is $216 this week...",
  "categories": [
    {
      "name": "Groceries",
      "total": 216.77,
      "budget": 300,
      "insight": "You're doing great!"
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

### Module not found errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styling not applied

1. Check import statements in JSX files
2. Verify CSS files exist in same folder
3. Clear browser cache (Cmd+Shift+R)

---

## 📦 Building for Production

```bash
# Create optimized build
npm run build

# Serve the build locally
npx serve -s build
```

---

## 🚢 Deployment Options

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag 'build' folder to netlify.com
```

### GitHub Pages
```bash
npm install --save-dev gh-pages

# Add to package.json:
"homepage": "https://yourusername.github.io/savie",
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [CSS Modules](https://github.com/css-modules/css-modules)
- [N8N Documentation](https://docs.n8n.io)

---

## 💬 Support

For issues or questions:
1. Check the README.md
2. Review component files
3. Check browser console for errors

---

Made with ❤️ for Australian shoppers
