import { Link } from "react-router-dom"
import "./BottomNav.css"

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <Link to="/overview" className="bottom-nav-button">
        <div className="bottom-nav-icon">💰</div>
        <span>Overview</span>
      </Link>

      <Link to="/fuel" className="bottom-nav-button">
        <div className="bottom-nav-icon">⛽</div>
        <span>Fuel</span>
      </Link>

      <Link to="/groceries" className="bottom-nav-button">
        <div className="bottom-nav-icon">🛒</div>
        <span>Groceries</span>
      </Link>

      <Link to="/aianalysis" className="bottom-nav-button">
        <div className="bottom-nav-icon">🤖</div>
        <span>AI</span>
      </Link>
      <Link to="/goals" className="bottom-nav-button">
        <div className="bottom-nav-icon">🥅</div>
        <span>Goals</span>
      </Link>
    </nav>
  )
}

export default BottomNav
