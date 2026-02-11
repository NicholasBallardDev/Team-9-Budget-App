import './FinancialOverview.css';

function FinancialOverview({ insights, onNavigate }) {
  // Safety check - if no insights, show loading or error
  if (!insights) {
    return (
      <div className="financial-overview">
        <div className="overview-header">
          <h1>Loading your insights...</h1>
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

  return (
    <div className="financial-overview">
      {/* Header */}
      <div className="overview-header">
        <h1 className="overview-title">Financial Overview</h1>
        <p className="overview-subtitle">Your spending insights for February</p>
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

        {insights.categories.map((category) => {
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