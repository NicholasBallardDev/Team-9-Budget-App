import { useState } from 'react';
import Onboarding from './pages/Onboarding/Onboarding';
import FinancialOverview from './pages/FinancialOverview/FinancialOverview';
import FuelPrices from './pages/FuelPrices/FuelPrices';
import GroceryComparison from './pages/GroceryComparison/GroceryComparison';
import InsightPopup from './components/InsightPopup/InsightPopup';
import ChatWidget from './components/ChatWidget/ChatWidget';
import BottomNav from './components/BottomNav/BottomNav';
import './App.css';

const N8N_WEBHOOK_URL = "https://cee-wee.app.n8n.cloud/webhook-test/savie-form";

function App() {
  const sessionId = 1
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [showInsightPopup, setShowInsightPopup] = useState(false);
  const [initialInsight, setInitialInsight] = useState("");
  const [currentPage, setCurrentPage] = useState("overview");
  const [formData, setFormData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const handleOnboardingComplete = async (data) => {
    setLoadingInsights(true);
    setFormData(data);

    const payload = {
      sessionId,
      financialGoal: data.financialGoal,
      age: parseInt(data.age),
      income: data.income,
      postcode: data.postcode,
      bank: data.bank,
      goal: data.goal || null,
    };

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const responseData = await response.json();
        setInsights(responseData);
        
        if (responseData.initialInsight) {
          setInitialInsight(responseData.initialInsight);
          setShowInsightPopup(true);
        }
      }
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
        <FuelPrices onNavigate={setCurrentPage} />
      )}
      
      {currentPage === "groceries" && (
        <GroceryComparison onNavigate={setCurrentPage} />
      )}

      <ChatWidget />
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
