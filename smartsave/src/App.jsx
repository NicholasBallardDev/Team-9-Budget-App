import { useState } from 'react';
import Onboarding from './pages/Onboarding/Onboarding';
import FinancialOverview from './pages/FinancialOverview/FinancialOverview';
import FuelPrices from './pages/FuelPrices/FuelPrices';
import GroceryComparison from './pages/GroceryComparison/GroceryComparison';
import InsightPopup from './components/InsightPopup/InsightPopup';
import BottomNav from './components/BottomNav/BottomNav';
import AIAnalysis from './pages/AIAnalysis/AIAnalysis';
import './App.css';

const N8N_FINANCIAL_WEBHOOK = "/api/n8n/webhook/savie-form";
const N8N_FUEL_WEBHOOK = "/api/n8n/webhook/fuel-check";
const N8N_GROCERY_WEBHOOK = "/api/n8n/webhook/grocery-comparison";

// Mock transaction data
const MOCK_TRANSACTIONS = [
  { date: "2025-02-10", description: "Woolworths", category: "Groceries", amount: -127.45 },
  { date: "2025-02-09", description: "Netflix", category: "Entertainment", amount: -16.99 },
  { date: "2025-02-08", description: "Coles", category: "Groceries", amount: -89.32 },
  { date: "2025-02-07", description: "Salary Deposit", category: "Income", amount: 3200.00 },
  { date: "2025-02-06", description: "Uber Eats", category: "Dining", amount: -42.50 },
  { date: "2025-02-05", description: "Chemist Warehouse", category: "Healthcare", amount: -34.20 },
  { date: "2025-02-04", description: "Shell Petrol", category: "Transport", amount: -68.00 },
  { date: "2025-02-03", description: "JB Hi-Fi", category: "Shopping", amount: -249.00 },
  { date: "2025-02-02", description: "Kmart", category: "Shopping", amount: -56.80 },
  { date: "2025-01-31", description: "Rent Payment", category: "Housing", amount: -1600.00 }
];

// Get or create session ID
function getSessionId() {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

function App() {
  const [sessionId] = useState(getSessionId());
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [showInsightPopup, setShowInsightPopup] = useState(false);
  const [initialInsight, setInitialInsight] = useState("");
  const [currentPage, setCurrentPage] = useState("overview");
  const [formData, setFormData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [fuelData, setFuelData] = useState(null);
  const [groceryData, setGroceryData] = useState(null);
  const handleOnboardingComplete = async (data) => {
  setLoadingInsights(true);
  setFormData(data);
  
  // Save postcode for fuel prices
  localStorage.setItem('userPostcode', data.postcode);

  const financialPayload = {
    sessionId,
    financialGoal: data.financialGoal,
    age: parseInt(data.age),
    income: data.income,
    postcode: data.postcode,
    bank: data.bank,
    goal: data.goal || null,
    transactions: MOCK_TRANSACTIONS
  };

  try {
    // Call financial insights API
    const response = await fetch(N8N_FINANCIAL_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(financialPayload)
    });

    if (response.ok) {
      const responseData = await response.json();
      setInsights(responseData);
      
      if (responseData.initialInsight) {
        setInitialInsight(responseData.initialInsight);
        setShowInsightPopup(true);
      }
    }

    // Pre-load fuel data in background (non-blocking)
    fetch(N8N_FUEL_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postcode: data.postcode,
        fuelType: "U91",
        sessionId: sessionId
      })
    })
      .then(res => res.json())
      .then(fuelDataResponse => {
        setFuelData(fuelDataResponse); // ADD THIS
        localStorage.setItem('fuelData', JSON.stringify(fuelDataResponse));
        console.log('✅ Fuel data pre-loaded:', fuelDataResponse);
      })
      .catch(err => console.log('⚠️ Fuel pre-load failed (non-critical):', err));

    // Pre-load grocery data in background (ADD THIS WHOLE BLOCK)
    //n8n integration
    fetch(N8N_GROCERY_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postcode: data.postcode,
        weeklyBudget: 300,
        sessionId: sessionId
      })
    })
      .then(res => res.json())
      .then(groceryDataResponse => {
        setGroceryData(groceryDataResponse);
        localStorage.setItem('groceryData', JSON.stringify(groceryDataResponse));
        console.log('✅ Grocery data pre-loaded:', groceryDataResponse);
      })
      .catch(err => console.log('⚠️ Grocery pre-load failed (non-critical):', err));

  } catch (error) {
    console.error("Error submitting to N8N:", error);
    
    // Mock insights for demo
    setInsights({
      initialInsight: "Your grocery spending is $216 this week. Small tweaks here could save $50/month 💡",
      categories: [
        { name: "Groceries", total: 216.77, budget: 300, insight: "You're doing great! Under budget by $83." },
        { name: "Transport", total: 68.00, budget: 100, insight: "If you save $10 per fill, that's about $100 a year 💡" },
        { name: "Shopping", total: 305.80, budget: 200, insight: "Big purchases this month. Try spreading them out." },
        { name: "Entertainment", total: 16.99, budget: 50, insight: "Subscriptions are on track!" },
        { name: "Housing", total: 1600.00, budget: 1600, insight: "Right on budget 👍" }
      ]
    });
    setInitialInsight("Your grocery spending is $216 this week. Small tweaks here could save $50/month 💡");
    setShowInsightPopup(true);
    
  } finally {
    setLoadingInsights(false);
  }
};

  const closeInsightPopup = () => {
    setShowInsightPopup(false);
    setIsOnboarding(false);
    setCurrentPage("overview");
  };

  if (showInsightPopup) {
    return (
      <InsightPopup 
        insight={initialInsight} 
        onClose={closeInsightPopup} 
      />
    );
  }

  if (isOnboarding) {
    return (
      <Onboarding 
        onComplete={handleOnboardingComplete}
        isLoading={loadingInsights}
      />
    );
  }

  return (
    <div className="app">
      {currentPage === "overview" && (
        <FinancialOverview 
          insights={insights}
          onNavigate={setCurrentPage}
        />
      )}
      
      {currentPage === "fuel" && (
        <FuelPrices 
          onNavigate={setCurrentPage} 
          userPostcode={formData?.postcode}
          initialFuelData={fuelData}
        />
      )}
      
      {currentPage === "groceries" && (
        <GroceryComparison onNavigate={setCurrentPage} userPostcode={formData?.postcode} initialGroceryData={groceryData} />
      )}

      {currentPage === "aianalysis" && (
        <AIAnalysis onNavigate={setCurrentPage} />
      )}

      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;