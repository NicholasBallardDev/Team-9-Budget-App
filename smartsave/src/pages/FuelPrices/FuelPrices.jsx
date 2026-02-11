import { useState } from 'react';
import BrandBadge from '../../components/BrandBadge/BrandBadge';
import './FuelPrices.css';

function FuelPrices({ onNavigate }) {
  const [selectedFuel, setSelectedFuel] = useState("U91");
  
  const mostVisited = getMostVisitedStation();
  const rewardsProgress = (mostVisited.visits / 10) * 100;

  const fuelStations = MOCK_FUEL_STATIONS
    .map(station => ({
      ...station,
      selectedPrice: station.prices[selectedFuel]
    }))
    .filter(station => station.selectedPrice !== null)
    .sort((a, b) => a.selectedPrice - b.selectedPrice);

  return (
    <div className="fuel-prices">
      {/* Header */}
      <div className="fuel-header">
        <div className="fuel-header-top">
          <button className="back-button" onClick={() => onNavigate("overview")}>
            ←
          </button>
          <h2 className="fuel-title">⛽ Fuel Prices</h2>
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

      {/* Partnership Rewards */}
      <div className="rewards-card">
        <div className="rewards-header">
          <div>
            <div className="rewards-label">
              {mostVisited.brand.toUpperCase()} REWARDS
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

      {/* Stations list */}
      <div className="stations-section">
        <h3 className="stations-title">Nearby Stations</h3>


        {fuelStations.map((station, idx) => (
          <div 
            key={station.id} 
            className={`station-card ${idx === 0 ? 'best' : ''}`}
          >
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FuelPrices;
