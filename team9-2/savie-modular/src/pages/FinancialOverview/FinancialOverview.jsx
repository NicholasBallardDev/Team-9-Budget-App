import { getCategoryTotals } from '../../utils/mockData';
import './FinancialOverview.css';

function FinancialOverview({ insights, onNavigate }) {
  const categoryTotals = getCategoryTotals();

  return (
    <div className="financial-overview">
      {/* Header */}
      <div className="overview-header">
        <h1 className="overview-title">Financial Overview</h1>
        <p className="overview-subtitle">Your spending insights for February</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action-card" onClick={() => onNavigate("fuel")}>
          <div className="quick-action-icon">⛽</div>
          <div className="quick-action-title">Compare Fuel</div>
        </button>

        <button className="quick-action-card" onClick={() => onNavigate("groceries")}>
          <div className="quick-action-icon">🛒</div>
          <div className="quick-action-title">Find Deals</div>
        </button>
      </div>

      {/* Category Breakdown */}
      <div className="category-section">
        <h2 className="section-title">Where your money goes</h2>

        {Object.entries(categoryTotals).map(([category, total]) => {
          const budget = category === "Housing" ? 1600 : category === "Groceries" ? 300 : category === "Shopping" ? 200 : 100;
          const percentage = Math.min((total / budget) * 100, 100);
          const isOverBudget = total > budget;

          return (
            <div key={category} className="category-card">
              <div className="category-header">
                <span className="category-name">{category}</span>
                <span className={`category-amount ${isOverBudget ? 'over' : 'under'}`}>
                  ${total.toFixed(2)}
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
                  {percentage.toFixed(0)}% of ${budget} budget
                </span>
                {isOverBudget ? (
                  <span className="budget-status over">
                    Over by ${(total - budget).toFixed(2)}
                  </span>
                ) : (
                  <span className="budget-status under">
                    Under by ${(budget - total).toFixed(2)}
                  </span>
                )}
              </div>

              {category === "Transport" && (
                <div className="category-insight">
                  💡 If you save $10 per fill, that's about $100 a year
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
