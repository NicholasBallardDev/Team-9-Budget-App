import React from "react"
import "./SavingsSummary.css"

function SavingsSummary({ weeklySavings }) {
  return (
    <div className="savings-summary">
      <div className="savings-header">
        <h3>Weekly Savings</h3>
        <p className="savings-message">Keep up the great work!</p>
      </div>
      <div className="savings-amount">${weeklySavings.toFixed(2)}</div>
    </div>
  )
}

export default SavingsSummary

// SavingsSummary.css
