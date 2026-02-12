import { useState, useEffect, useRef } from 'react';
import BrandBadge from '../../components/BrandBadge/BrandBadge';
import './FuelPrices.css';

const FUEL_TYPES = [
  { id: "U91", short: "U91", name: "Unleaded 91" },
  { id: "U95", short: "U95", name: "Unleaded 95" },
  { id: "U98", short: "U98", name: "Unleaded 98" },
  { id: "E10", short: "E10", name: "Ethanol 10" },
  { id: "Diesel", short: "DSL", name: "Diesel" }
];

// Mock data fallback
const MOCK_FUEL_DATA = {
  fuelType: "U91",
  locationName: "Sydney CBD",
  cheapestPrice: 1.619,
  weeklySavings: 12.5,
  insight: "Fuel prices are 8¢ lower than last week! Great time to fill up.",
  stations: [
    {
      id: 1,
      name: "Metro Petroleum St Leonards",
      address: "34 Pacific Hwy, St Leonards NSW 2065",
      brand: "Metro",
      selectedPrice: 1.619
    },
    {
      id: 2,
      name: "7-Eleven Crows Nest",
      address: "12 Falcon St, Crows Nest NSW 2065",
      brand: "7-Eleven",
      selectedPrice: 1.659
    },
    {
      id: 3,
      name: "BP Mosman",
      address: "456 Military Rd, Mosman NSW 2088",
      brand: "BP",
      selectedPrice: 1.649
    },
    {
      id: 4,
      name: "Shell Neutral Bay",
      address: "789 Military Rd, Neutral Bay NSW 2089",
      brand: "Shell",
      selectedPrice: 1.679
    },
    {
      id: 5,
      name: "Coles Express Chatswood",
      address: "445 Victoria Ave, Chatswood NSW 2067",
      brand: "Coles",
      selectedPrice: 1.679
    }
  ],
  mostVisitedStation: {
    brand: "7-Eleven",
    visits: 8
  }
};

function FuelPrices({ onNavigate, userPostcode }) {
  const [selectedFuel, setSelectedFuel] = useState("U91");
  const [fuelData, setFuelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const hasFetchedRef = useRef(false);
  const timeoutRef = useRef(null);

  // Get postcode from props or localStorage
  const postcode = userPostcode || localStorage.getItem('userPostcode') || '2000';

  useEffect(() => {
    // Reset the ref when fuel type changes
    hasFetchedRef.current = false;
    setUsingMockData(false);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If we have cached data for this fuel type, use it
    if (fuelData && fuelData.fuelType === selectedFuel && !usingMockData) {
      console.log('✅ Using cached fuel data');
      return;
    }

    // Prevent duplicate fetches in strict mode
    if (hasFetchedRef.current) {
      console.log('⏭️ Already fetching, skipping');
      return;
    }

    hasFetchedRef.current = true;
    fetchFuelPrices();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [selectedFuel]);

  const fetchFuelPrices = async () => {
    setLoading(true);
    setError(null);

    // Set a 2-second timeout to fallback to mock data
    timeoutRef.current = setTimeout(() => {
      console.warn('⚠️ API taking too long, using mock data');
      setUsingMockData(true);
      setFuelData({
        ...MOCK_FUEL_DATA,
        fuelType: selectedFuel
      });
      setLoading(false);
    }, 2000);

    try {
      const response = await fetch('/api/n8n/webhook/fuel-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postcode: postcode,
          fuelType: selectedFuel,
          sessionId: localStorage.getItem('sessionId') || 'demo-session'
        })
      });

      // Clear timeout if request completes in time
      clearTimeout(timeoutRef.current);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Fuel data received from API:', data);
      
      // Only update if we haven't already shown mock data
      if (!usingMockData) {
        setFuelData(data);
      }

    } catch (error) {
      console.error('❌ Error fetching fuel prices:', error);
      
      // Clear timeout
      clearTimeout(timeoutRef.current);
      
      // If we haven't shown mock data yet, show it now
      if (!usingMockData) {
        console.log('🔄 Falling back to mock data due to error');
        setUsingMockData(true);
        setFuelData({
          ...MOCK_FUEL_DATA,
          fuelType: selectedFuel
        });
      }
      
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fuel-prices">
        <div className="fuel-header">
          <div className="fuel-header-top">
            <button className="back-button" onClick={() => onNavigate("overview")}>
              ←
            </button>
            <h2 className="fuel-title">⛽ Fuel prices around your suburb</h2>
          </div>
        </div>
        <div className="loading-container">
          <div className="spinner">⛽</div>
          <p>Finding the cheapest fuel near you...</p>
        </div>
      </div>
    );
  }

  if (!fuelData) {
    return (
      <div className="fuel-prices">
        <div className="fuel-header">
          <h2>⛽ Loading...</h2>
        </div>
      </div>
    );
  }

  const mostVisited = fuelData.mostVisitedStation;
  const rewardsProgress = (mostVisited.visits / 10) * 100;

  return (
    <div className="fuel-prices">
      {/* Header */}
      <div className="fuel-header">
        <div className="fuel-header-top">
          <button className="back-button" onClick={() => onNavigate("overview")}>
            ←
          </button>
          <h2 className="fuel-title">⛽ Fuel prices around your suburb</h2>
        </div>

        {/* Mock data indicator */}
        {usingMockData && (
          <div className="mock-data-banner">
            ℹ️ Showing sample data (API unavailable)
          </div>
        )}

        {/* Location indicator */}
        <div className="fuel-location">
          📍 Near {fuelData.locationName}
        </div>

        {/* Fuel type selector */}
        <div className="fuel-type-selector">
          {FUEL_TYPES.map(fuel => (
            <button
              key={fuel.id}
              className={`fuel-type-button ${selectedFuel === fuel.id ? 'active' : ''}`}
              onClick={() => setSelectedFuel(fuel.id)}
            >
              {fuel.short}
            </button>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      {fuelData.insight && (
        <div className="fuel-insight-banner">
          {fuelData.insight}
        </div>
      )}

      {/* Partnership Rewards */}
      <div className="rewards-card">
        <div className="rewards-header">
          <div>
            <div className="rewards-label">
              {mostVisited.brand?.toUpperCase()} REWARDS
            </div>
            <div className="rewards-visits">
              {mostVisited.visits} / 10 visits
            </div>
          </div>
          <div className="rewards-icon">🎁</div>
        </div>

        <div className="rewards-progress">
          <div 
            className="rewards-progress-bar"
            style={{ width: `${rewardsProgress}%` }}
          />
        </div>

        <p className="rewards-message">
          {mostVisited.visits >= 10 
            ? "🎉 You've earned a $10 gift card!" 
            : `${10 - mostVisited.visits} more visits to earn a $10 gift card`}
        </p>
      </div>

      {/* Best price callout */}
      {fuelData.cheapestPrice && (
        <div className="best-price-banner">
          💰 Best price: <strong>${fuelData.cheapestPrice.toFixed(2)}/L</strong>
          {fuelData.weeklySavings > 0 && ` • Save $${fuelData.weeklySavings}/week`}
        </div>
      )}

      {/* Stations list */}
      <div className="stations-section">
        <h3 className="stations-title">Nearby Stations</h3>

        {fuelData.stations && fuelData.stations.length > 0 ? (
          fuelData.stations.map((station, idx) => {
            const savings = idx > 0 ? (station.selectedPrice - fuelData.cheapestPrice) : 0;
            
            return (
              <div 
                key={station.id} 
                className={`station-card ${idx === 0 ? 'best' : ''}`}
              >
                {idx === 0 && <div className="best-badge">🏆 Best Price</div>}
                
                <BrandBadge brand={station.brand} />
                
                <div className="station-info">
                  <div className="station-name">{station.name}</div>
                  <div className="station-address">{station.address}</div>
                </div>
                
                <div className="station-price">
                  <div className={`price-value ${idx === 0 ? 'best' : ''}`}>
                    ${station.selectedPrice.toFixed(2)}
                  </div>
                  <div className="price-unit">per litre</div>
                  {savings > 0 && (
                    <div className="price-diff">
                      +${savings.toFixed(1)} more
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-stations">
            <p>No stations found for {selectedFuel}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FuelPrices;