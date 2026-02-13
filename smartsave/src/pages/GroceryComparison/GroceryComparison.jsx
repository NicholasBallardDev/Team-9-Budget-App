import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./GroceryComparison.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const DUMMY_GROCERY_DATA = {
  locationName: "Sydney CBD",
  insight:
    "You could save up to $25 this week by switching from Coles to Aldi for your main shop.",
  weeklySavings: 25.35,
  monthlySavings: 101.4,
  storeComparison: [
    {
      store: "Aldi",
      total: 112.5,
      nearbyLocations: ["George St", "World Square"],
      color: "#00509A",
    },
    {
      store: "Woolworths",
      total: 128.75,
      nearbyLocations: ["Town Hall", "Metcentre"],
      color: "#178841",
    },
    {
      store: "Coles",
      total: 137.85,
      nearbyLocations: ["Wynyard", "World Square"],
      color: "#E52421",
    },
  ],
  topDeals: [
    {
      item: "1kg Beef Mince",
      cheapestStore: "Aldi",
      price: 12.0,
      savings: 4.5,
    },
    { item: "2L Milk", cheapestStore: "Woolworths", price: 3.1, savings: 0.4 },
    {
      item: "Avocados (2-pack)",
      cheapestStore: "Aldi",
      price: 3.5,
      savings: 1.5,
    },
  ],
}

function GroceryComparison({ userPostcode, initialGroceryData }) {
  const [groceryData, setGroceryData] = useState(initialGroceryData)
  const [loading, setLoading] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)
  const hasFetchedRef = useRef(false)
  const navigate = useNavigate()

  const postcode =
    userPostcode || localStorage.getItem("userPostcode") || "2000"

  useEffect(() => {
    // If we have cached data, use it
    if (groceryData && !usingMockData) {
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
    console.log("🚀 Starting fetch at:", new Date().toISOString())
    setLoading(true)
    let timeoutTriggered = false
    let timeoutId = null

    // Set a 2-second timeout to fallback to mock data
    timeoutId = setTimeout(() => {
      console.warn("⚠️ TIMEOUT TRIGGERED at:", new Date().toISOString())
      timeoutTriggered = true
      setUsingMockData(true)
      setGroceryData(DUMMY_GROCERY_DATA)
      setLoading(false)
      console.log("✅ Loading set to false, data set to mock")
    }, 2000)

    try {
      const response = await fetch("/api/n8n/webhook/grocery-comparison", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postcode: postcode,
          weeklyBudget: 300,
          sessionId: localStorage.getItem("sessionId") || "demo-session",
        }),
      })

      console.log("📡 Response received at:", new Date().toISOString())

      // Clear timeout if request completes in time
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // If timeout already triggered, ignore this response
      if (timeoutTriggered) {
        console.log("⏭️ API returned late, ignoring response")
        return
      }

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
      setUsingMockData(false)
      setLoading(false)
    } catch (error) {
      console.error("❌ Error fetching grocery data:", error)

      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      // If timeout hasn't triggered yet, show mock data
      if (!timeoutTriggered) {
        console.log("🔄 Falling back to mock data due to error")
        setUsingMockData(true)
        setGroceryData(DUMMY_GROCERY_DATA)
        setLoading(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="grocery-comparison">
        <div className="grocery-header">
          <div className="grocery-header-top">
            <button
              className="back-button"
              onClick={() => navigate("/overview")}
            >
              ←
            </button>
            <h2 className="grocery-title">🛒 Grocery Comparison</h2>
          </div>
        </div>
        <div className="loading-container">
          <div className="grocery-cart-icon">🛒</div>
          <p>Finding the best grocery prices...</p>
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
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
      {/* Header */}
      <div className="grocery-header">
        <div className="grocery-header-top">
          <button className="back-button" onClick={() => navigate("/overview")}>
            ←
          </button>
          <h2 className="grocery-title">🛒 Grocery Comparison</h2>
        </div>

        {/* Mock data indicator */}
        {usingMockData && (
          <div className="mock-data-banner">
            ℹ️ API taking longer than expected - displaying sample data
          </div>
        )}

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