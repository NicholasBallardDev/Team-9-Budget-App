import { Link } from 'react-router-dom';
import './BottomNav.css';

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <button
        to="/"
        className="bottom-nav-button"
      >
        💰 Overview
      </button>
      
      <button
        className={`bottom-nav-button`}
      >
        <div className="bottom-nav-icon">⛽</div>
        <span>Fuel</span>
      </button>
      
      <button
        className={`bottom-nav-button`}
        onClick={() => onNavigate("groceries")}
      >
        <div className="bottom-nav-icon">🛒</div>
        <span>Groceries</span>
      </button>

      <button
        className={`bottom-nav-button`}
      >
        <div className="bottom-nav-icon">🤖</div>
        <span>AI</span>
      </button>
    </nav>
  );
}

export default BottomNav;
