import { useState, useEffect } from 'react';
import './AIAnalysis.css';

function AIOverview({ formData, onNavigate }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis based on questionnaire data
    generateInsights();
  }, [formData]);

  const generateInsights = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate insights based on questionnaire responses
    const age = parseInt(formData?.age) || 25;
    const income = formData?.income || 50000;
    const goal = formData?.financialGoal || 'budgeting';
    const savingGoal = formData?.goal || '';
    const name = formData?.name || 'there';

    const analysisData = {
      name: name,
      personalizedGreeting: `Based on your profile, here's your financial snapshot:`,
      ageInsight: generateAgeInsight(age),
      incomeInsight: generateIncomeInsight(income),
      goalInsight: generateGoalInsight(goal, savingGoal),
      recommendations: generateRecommendations(age, income, goal),
      savingsPotential: calculateSavingsPotential(income),
      budgetBreakdown: generateBudgetBreakdown(income),
    };

    setInsights(analysisData);
    setLoading(false);
  };

  const generateAgeInsight = (age) => {
    if (age < 25) {
      return {
        title: "Early Career Stage",
        message: "You're at a great age to build strong financial habits. Focus on building an emergency fund and start investing early.",
        icon: "🌱"
      };
    } else if (age < 35) {
      return {
        title: "Growth Phase",
        message: "This is a critical decade for wealth building. Balance enjoying life with aggressive saving and investing.",
        icon: "📈"
      };
    } else if (age < 50) {
      return {
        title: "Peak Earning Years",
        message: "Maximize your earning potential and accelerate retirement savings. Review and optimize your investment portfolio.",
        icon: "💼"
      };
    } else {
      return {
        title: "Pre-Retirement Focus",
        message: "Focus on preserving wealth and ensuring your retirement strategy is on track. Consider tax-efficient strategies.",
        icon: "🎯"
      };
    }
  };

  const generateIncomeInsight = (income) => {
    const monthlyIncome = income / 12;
    return {
      monthlyIncome: monthlyIncome.toFixed(0),
      takeHome: (monthlyIncome * 0.75).toFixed(0), // Approximate after tax
      message: income < 40000 
        ? "Every dollar counts. Focus on building an emergency fund and tracking expenses carefully."
        : income < 80000
        ? "You have good income stability. Balance current needs with future goals."
        : "You're in a strong financial position. Maximize tax-advantaged accounts and consider wealth-building strategies."
    };
  };

  const generateGoalInsight = (goal, savingGoal) => {
    const goalMessages = {
      budgeting: {
        title: "Budgeting Focus",
        message: "We'll help you track every dollar and identify opportunities to optimize your spending.",
        tips: [
          "Track spending patterns with our AI insights",
          "Get alerts when you're approaching budget limits",
          "Find cheaper alternatives for regular purchases"
        ]
      },
      saving: {
        title: "Saving Goals",
        message: savingGoal 
          ? `Great! Working towards "${savingGoal}" gives you clear direction.`
          : "Setting specific savings targets will help you stay motivated.",
        tips: [
          "Automate savings to reach your goal faster",
          "Find deals on fuel and groceries to boost savings",
          "Get personalized tips to cut unnecessary expenses"
        ]
      }
    };
    return goalMessages[goal] || goalMessages.budgeting;
  };

  const generateRecommendations = (age, income, goal) => {
    const recommendations = [];

    // Age-based recommendations
    if (age < 30) {
      recommendations.push({
        category: "Investing",
        title: "Start Investing Early",
        description: "Time is your biggest advantage. Even small amounts invested now can grow significantly.",
        priority: "high"
      });
    }

    // Income-based recommendations
    if (income > 60000) {
      recommendations.push({
        category: "Tax",
        title: "Maximize Tax Benefits",
        description: "Consider salary sacrificing or maximizing super contributions to reduce taxable income.",
        priority: "medium"
      });
    }

    // Goal-based recommendations
    if (goal === 'saving') {
      recommendations.push({
        category: "Savings",
        title: "Automate Your Savings",
        description: "Set up automatic transfers to your savings account on payday.",
        priority: "high"
      });
    }

    // Universal recommendations
    recommendations.push({
      category: "Daily Savings",
      title: "Use Savie's Smart Features",
      description: "Save on fuel and groceries every week - small savings add up to thousands per year.",
      priority: "high"
    });

    return recommendations;
  };

  const calculateSavingsPotential = (income) => {
    const monthlyIncome = income / 12;
    const potentialSavings = {
      fuel: { monthly: 80, yearly: 960 },
      groceries: { monthly: 150, yearly: 1800 },
      utilities: { monthly: 50, yearly: 600 },
      total: { monthly: 280, yearly: 3360 }
    };

    return potentialSavings;
  };

  const generateBudgetBreakdown = (income) => {
    const monthlyIncome = income / 12;
    const takeHome = monthlyIncome * 0.75; // After tax estimate

    return {
      housing: { amount: (takeHome * 0.30).toFixed(0), percentage: 30, label: "Housing" },
      groceries: { amount: (takeHome * 0.15).toFixed(0), percentage: 15, label: "Groceries" },
      transport: { amount: (takeHome * 0.15).toFixed(0), percentage: 15, label: "Transport" },
      utilities: { amount: (takeHome * 0.08).toFixed(0), percentage: 8, label: "Utilities" },
      savings: { amount: (takeHome * 0.20).toFixed(0), percentage: 20, label: "Savings" },
      discretionary: { amount: (takeHome * 0.12).toFixed(0), percentage: 12, label: "Discretionary" }
    };
  };

  if (loading) {
    return (
      <div className="ai-overview">
        <div className="overview-header">
          {/* <button className="back-button" onClick={() => onNavigate("overview")}>←</button> */}
          <h1 className="overview-title">🤖 AI Financial Overview</h1>
        </div>
        <div className="loading-state">
          <div className="loading-spinner">🤖</div>
          <p>Analyzing your financial profile...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="ai-overview">
        <div className="overview-header">
          {/* <button className="back-button" onClick={() => onNavigate("overview")}>←</button> */}
          <h1 className="overview-title">🤖 AI Financial Overview</h1>
        </div>
        <div className="error-state">
          <p>Unable to generate insights. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-overview">
      {/* Header */}
      <div className="overview-header">
        <button className="back-button" onClick={() => onNavigate("overview")}>←</button>
        <div>
          <h1 className="overview-title">🤖 AI Financial Overview</h1>
          <p className="overview-subtitle">Personalized insights for {insights.name}</p>
        </div>
      </div>

      {/* Greeting Card */}
      <div className="greeting-card">
        <h2>Hi {insights.name}! 👋</h2>
        <p>{insights.personalizedGreeting}</p>
      </div>

      {/* Age Insight */}
      <div className="insight-card age-insight">
        <div className="insight-icon">{insights.ageInsight.icon}</div>
        <div className="insight-content">
          <h3>{insights.ageInsight.title}</h3>
          <p>{insights.ageInsight.message}</p>
        </div>
      </div>

      {/* Income Insight */}
      <div className="insight-card income-insight">
        <h3>💰 Your Income Profile</h3>
        <div className="income-grid">
          <div className="income-stat">
            <div className="stat-label">Monthly Income</div>
            <div className="stat-value">${insights.incomeInsight.monthlyIncome}</div>
          </div>
          <div className="income-stat">
            <div className="stat-label">Est. Take Home</div>
            <div className="stat-value">${insights.incomeInsight.takeHome}</div>
          </div>
        </div>
        <p className="income-message">{insights.incomeInsight.message}</p>
      </div>

      {/* Goal Insight */}
      <div className="insight-card goal-insight">
        <h3>🎯 {insights.goalInsight.title}</h3>
        <p className="goal-message">{insights.goalInsight.message}</p>
        <div className="goal-tips">
          <h4>How Savie can help:</h4>
          <ul>
            {insights.goalInsight.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Savings Potential */}
      <div className="insight-card savings-potential">
        <h3>💸 Your Savings Potential</h3>
        <p className="savings-intro">By using Savie to find better deals, you could save:</p>
        <div className="savings-grid">
          <div className="savings-item">
            <div className="savings-icon">⛽</div>
            <div className="savings-label">Fuel</div>
            <div className="savings-amount">${insights.savingsPotential.fuel.monthly}/mo</div>
            <div className="savings-yearly">${insights.savingsPotential.fuel.yearly}/year</div>
          </div>
          <div className="savings-item">
            <div className="savings-icon">🛒</div>
            <div className="savings-label">Groceries</div>
            <div className="savings-amount">${insights.savingsPotential.groceries.monthly}/mo</div>
            <div className="savings-yearly">${insights.savingsPotential.groceries.yearly}/year</div>
          </div>
          <div className="savings-item">
            <div className="savings-icon">💡</div>
            <div className="savings-label">Utilities</div>
            <div className="savings-amount">${insights.savingsPotential.utilities.monthly}/mo</div>
            <div className="savings-yearly">${insights.savingsPotential.utilities.yearly}/year</div>
          </div>
        </div>
        <div className="savings-total">
          <div className="total-label">Total Potential Savings</div>
          <div className="total-amount">${insights.savingsPotential.total.yearly}/year</div>
        </div>
      </div>

      {/* Recommended Budget Breakdown */}
      <div className="insight-card budget-breakdown">
        <h3>📊 Recommended Budget Breakdown</h3>
        <p className="budget-subtitle">Based on your income, here's a suggested allocation:</p>
        <div className="budget-bars">
          {Object.values(insights.budgetBreakdown).map((item, idx) => (
            <div key={idx} className="budget-item">
              <div className="budget-header">
                <span className="budget-label">{item.label}</span>
                <span className="budget-amount">${item.amount}</span>
              </div>
              <div className="budget-bar-track">
                <div 
                  className="budget-bar-fill" 
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="budget-percentage">{item.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="insight-card recommendations">
        <h3>✨ Personalized Recommendations</h3>
        <div className="recommendations-grid">
          {insights.recommendations.map((rec, idx) => (
            <div key={idx} className={`recommendation-card priority-${rec.priority}`}>
              <div className="rec-header">
                <span className="rec-category">{rec.category}</span>
                {rec.priority === 'high' && <span className="priority-badge">High Priority</span>}
              </div>
              <h4 className="rec-title">{rec.title}</h4>
              <p className="rec-description">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-card">
        <h3>Ready to start saving?</h3>
        <p>Use Savie's features to track your spending and find the best deals in your area.</p>
        <div className="cta-buttons">
          <button className="cta-button primary" onClick={() => onNavigate("fuel")}>
            Find Cheap Fuel ⛽
          </button>
          <button className="cta-button secondary" onClick={() => onNavigate("groceries")}>
            Compare Groceries 🛒
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIOverview;