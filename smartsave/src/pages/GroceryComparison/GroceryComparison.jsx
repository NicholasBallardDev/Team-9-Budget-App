import { useState, useEffect, useRef } from "react"
import "./GroceryComparison.css"

function GroceryComparison({ onNavigate, userPostcode, initialGroceryData }) {
  const [groceryData, setGroceryData] = useState(initialGroceryData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const hasFetchedRef = useRef(false)

  const postcode =
    userPostcode || localStorage.getItem("userPostcode") || "2000"

  useEffect(() => {
    // If we have cached data, use it
    if (groceryData) {
      console.log("✅ Using cached grocery data")
      return
    }

    // Prevent duplicate fetches
    if (hasFetchedRef.current) {
      console.log("⏭️ Already fetching, skipping")
      return
    }

    hasFetchedRef.current = true
    fetchGroceryData()
  }, [])

  const fetchGroceryData = async () => {
    console.log("Fetching grocery data...")
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        "https://cee-wee.app.n8n.cloud/webhook-test/grocery-comparison",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postcode: postcode,
            weeklyBudget: 300,
            sessionId: localStorage.getItem("sessionId") || "demo-session",
          }),
        },
      )

      console.log("Response status:", response.status)

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const text = await response.text()
      console.log("Response text:", text)

      if (!text || text.trim() === "") {
        throw new Error("Empty response from server")
      }

      const data = JSON.parse(text)
      console.log("✅ Grocery data received:", data)
      setGroceryData(data)
    } catch (error) {
      console.error("❌ Error fetching grocery data:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grocery-comparison">
        <div className="grocery-header">
          <div className="grocery-header-top">
            <button
              className="back-button"
              onClick={() => onNavigate("overview")}
            >
              ←
            </button>
            <h2 className="grocery-title">🛒 Grocery Comparison</h2>
          </div>
        </div>
        <div className="loading-container">
          <div className="spinner">🛒</div>
          <p>Finding the best grocery prices...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grocery-comparison">
        <div className="grocery-header">
          <div className="grocery-header-top">
            <button
              className="back-button"
              onClick={() => onNavigate("overview")}
            >
              ←
            </button>
            <h2 className="grocery-title">🛒 Grocery Comparison</h2>
          </div>
        </div>
        <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
          Error: {error}
        </div>
      </div>
    )
  }

  if (!groceryData) {
    return (
      <div className="grocery-comparison">
        <div className="grocery-header">
          <h2>🛒 Loading...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="grocery-comparison">
      {/* Header */}
      <div className="grocery-header">
        <div className="grocery-header-top">
          <button
            className="back-button"
            onClick={() => onNavigate("overview")}
          >
            ←
          </button>
          <h2 className="grocery-title">🛒 Grocery Comparison</h2>
        </div>

        {/* Location indicator */}
        <div className="grocery-location">
          📍 Near {groceryData.locationName}
        </div>
      </div>

      {/* AI Insight */}
      {groceryData.insight && (
        <div className="grocery-insight-banner">{groceryData.insight}</div>
      )}

      {/* Savings Summary */}
      <div className="savings-summary">
        <div className="savings-card">
          <div className="savings-label">Weekly Savings</div>
          <div className="savings-amount">
            ${groceryData.weeklySavings?.toFixed(2)}
          </div>
        </div>
        <div className="savings-card">
          <div className="savings-label">Monthly Savings</div>
          <div className="savings-amount highlight">
            ${groceryData.monthlySavings?.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Store Comparison */}
      <div className="stores-section">
        <h3 className="section-title">Store Comparison</h3>

        {groceryData.storeComparison &&
          groceryData.storeComparison.map((store, idx) => (
            <div
              key={store.store}
              className={`store-card ${idx === 0 ? "cheapest" : ""}`}
            >
              {idx === 0 && <div className="best-badge">🏆 Cheapest</div>}

              <div
                className="store-logo"
                style={{ backgroundColor: store.color }}
              >
                {store.store.charAt(0)}
              </div>

              <div className="store-info">
                <div className="store-name">{store.store}</div>
                <div className="store-locations">
                  {store.nearbyLocations && store.nearbyLocations[0]}
                </div>
              </div>

              <div className="store-total">
                <div className={`total-amount ${idx === 0 ? "best" : ""}`}>
                  ${store.total?.toFixed(2)}
                </div>
                <div className="total-label">basket total</div>
                {idx > 0 && (
                  <div className="price-diff">
                    +$
                    {(
                      store.total - groceryData.storeComparison[0].total
                    ).toFixed(2)}{" "}
                    more
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Top Deals */}
      <div className="deals-section">
        <h3 className="section-title">🔥 Top Deals</h3>

        {groceryData.topDeals &&
          groceryData.topDeals.map((deal, idx) => (
            <div key={idx} className="deal-card">
              <div className="deal-info">
                <div className="deal-item">{deal.item}</div>
                <div className="deal-store">
                  Cheapest at {deal.cheapestStore}
                </div>
              </div>
              <div className="deal-savings">
                <div className="deal-price">${deal.price}</div>
                <div className="deal-save">Save ${deal.savings}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default GroceryComparison
