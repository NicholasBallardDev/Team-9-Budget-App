import { useState, useEffect } from 'react';
import './GroceryComparison.css';

function GroceryComparison({ onNavigate }) {
  const [grocerySearch, setGrocerySearch] = useState("");
  const [filteredGroceries, setFilteredGroceries] = useState(MOCK_GROCERY_ITEMS);

  useEffect(() => {
    if (grocerySearch.trim() === "") {
      setFilteredGroceries(MOCK_GROCERY_ITEMS);
    } else {
      const filtered = MOCK_GROCERY_ITEMS.filter(item =>
        item.name.toLowerCase().includes(grocerySearch.toLowerCase()) ||
        item.category.toLowerCase().includes(grocerySearch.toLowerCase())
      );
      setFilteredGroceries(filtered);
    }
  }, [grocerySearch]);

  return (
    <div className="grocery-comparison">
      {/* Header */}
      <div className="grocery-header">
        <div className="grocery-header-top">
          <button className="back-button" onClick={() => onNavigate("overview")}>
            ←
          </button>
          <h2 className="grocery-title">🛒 Grocery Prices</h2>
        </div>

        {/* Search bar */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            value={grocerySearch}
            onChange={e => setGrocerySearch(e.target.value)}
            placeholder="Search for groceries..."
          />
        </div>
      </div>

      {/* Results */}
      <div className="grocery-results">
        {filteredGroceries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No items found. Try a different search.</p>
          </div>
        ) : (
          filteredGroceries.map((item, idx) => {
            const bestStore = item.coles <= item.woolworths ? "coles" : "woolworths";
            const savings = Math.abs(item.coles - item.woolworths).toFixed(2);

            return (
              <div key={idx} className="grocery-item-card">
                <div className="grocery-item-name">{item.name}</div>

                <div className="price-comparison">
                  {/* Coles */}
                  <div className={`store-price ${bestStore === "coles" ? "best" : ""}`}>
                    <div className="store-label coles">COLES</div>
                    <div className={`store-price-value ${bestStore === "coles" ? "best-coles" : ""}`}>
                      ${item.coles.toFixed(2)}
                    </div>
                    {bestStore === "coles" && (
                      <div className="best-price-badge">BEST PRICE</div>
                    )}
                  </div>

                  {/* Woolworths */}
                  <div className={`store-price ${bestStore === "woolworths" ? "best" : ""}`}>
                    <div className="store-label woolworths">WOOLWORTHS</div>
                    <div className={`store-price-value ${bestStore === "woolworths" ? "best-woolworths" : ""}`}>
                      ${item.woolworths.toFixed(2)}
                    </div>
                    {bestStore === "woolworths" && (
                      <div className="best-price-badge">BEST PRICE</div>
                    )}
                  </div>
                </div>

                {savings > 0 && (
                  <div className="savings-badge">
                    💰 Save ${savings} at {bestStore === "coles" ? "Coles" : "Woolworths"}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default GroceryComparison;
