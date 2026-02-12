import { useState, useEffect } from 'react';
import './FinancialOverview.css';

function FinancialOverview({ insights, onNavigate }) {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const loadingMessages = [
    "Loading...",
    "Hang on tight...",
    "Crunching the numbers...",
    "Making magic happen..."
  ];

  useEffect(() => {
    if (!insights) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1500); // Change message every 1.5 seconds

      return () => clearInterval(interval);
    }
  }, [insights]);

  // Safety check - if no insights, show playful loading
  if (!insights) {
    return (
      <div className="financial-overview">
        <div className="playful-loading">
          {/* Bouncing Money Bag */}
          <div className="bouncing-money-bag">
            <div className="money-bag-icon">💰</div>
          </div>
          
          {/* Rotating Messages */}
          <h1 className="loading-message">{loadingMessages[messageIndex]}</h1>
          
          {/* Progress dots */}
          <div className="loading-dots">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
          </div>
        </div>
      </div>
    );
  }

  // Safety check - if no categories, show error
  if (!insights.categories || insights.categories.length === 0) {
    return (
      <div className="financial-overview">
        <div className="overview-header">
          <h1>No insights available</h1>
          <p>Please complete the onboarding again.</p>
        </div>
      </div>
    );
  }

  // Sort categories by total spending (highest to lowest)
  const sortedCategories = [...insights.categories].sort((a, b) => b.total - a.total);

  // Get the user's name from insights
  const userName = insights.name || 'there';

  // Calculate month-on-month comparison
  // This assumes insights contains lastMonthTotal and currentMonthTotal
  // If not provided by API, we'll calculate from categories
  const currentMonthTotal = sortedCategories.reduce((sum, cat) => sum + cat.total, 0);
  const lastMonthTotal = insights.lastMonthTotal || currentMonthTotal * 0.92; // Mock: assume 8% less last month if not provided
  const monthlyChange = currentMonthTotal - lastMonthTotal;
  const monthlyChangePercent = lastMonthTotal > 0 ? ((monthlyChange / lastMonthTotal) * 100) : 0;

  return (
    <div className="financial-overview">
      {/* Header */}
      <div className="overview-header">
        <p className="welcome-text">Hi {userName}! Here's how you're going...</p>
        <h1 className="overview-title">Financial Overview</h1>
        <p className="overview-subtitle">Your spending insights for February</p>
      </div>

      {/* Month-on-Month Comparison */}
      <div className="month-comparison">
        <h3 className="comparison-title">Month-on-Month Comparison</h3>
        <div className="comparison-stats">
          <div className="stat-box">
            <div className="stat-label">This Month</div>
            <div className="stat-value">${currentMonthTotal.toFixed(0)}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Last Month</div>
            <div className="stat-value">${lastMonthTotal.toFixed(0)}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Change</div>
            <div className="stat-value">${Math.abs(monthlyChange).toFixed(0)}</div>
            <div className={`stat-change ${monthlyChange > 0 ? 'increase' : monthlyChange < 0 ? 'decrease' : 'neutral'}`}>
              {monthlyChange > 0 ? '↑' : monthlyChange < 0 ? '↓' : '→'} {Math.abs(monthlyChangePercent).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions
      <div className="quick-actions">
        <button className="quick-action-card" onClick={() => onNavigate("fuel")}>
          <div className="quick-action-icon">⛽</div>
          <div className="quick-action-title">Compare Fuel</div>
        </button>

        <button className="quick-action-card" onClick={() => onNavigate("groceries")}>
          <div className="quick-action-icon">🛒</div>
          <div className="quick-action-title">Find Deals</div>
        </button>
      </div> */}

      {/* Category Breakdown */}
      <div className="category-section">
        <h2 className="section-title">Where your money goes</h2>

        {sortedCategories.map((category) => {
          const percentage = Math.min((category.total / category.budget) * 100, 100);
          const isOverBudget = category.total > category.budget;

          return (
            <div key={category.name} className="category-card">
              <div className="category-header">
                <span className="category-name">{category.name}</span>
                <span className={`category-amount ${isOverBudget ? 'over' : 'under'}`}>
                  ${category.total.toFixed(2)}
                </span>
              </div>

              <div className="category-progress">
                <div 
                  className={`category-progress-bar ${isOverBudget ? 'over' : 'under'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="category-footer">
                <span className="budget-info">
                  {percentage.toFixed(0)}% of ${category.budget} budget
                </span>
                {isOverBudget ? (
                  <span className="budget-status over">
                    Over by ${(category.total - category.budget).toFixed(2)}
                  </span>
                ) : (
                  <span className="budget-status under">
                    Under by ${(category.budget - category.total).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Display the AI-generated insight for each category */}
              {category.insight && (
                <div className="category-insight">
                  {category.insight}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FinancialOverview;