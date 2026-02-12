import './BottomNav.css';

function BottomNav({ currentPage, onNavigate }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-button ${currentPage === "overview" ? "active" : ""}`}
        onClick={() => onNavigate("overview")}
      >
        <div className="bottom-nav-icon">💰</div>
        <span>Overview</span>
      </button>
      
      <button
        className={`bottom-nav-button ${currentPage === "fuel" ? "active" : ""}`}
        onClick={() => onNavigate("fuel")}
      >
        <div className="bottom-nav-icon">⛽</div>
        <span>Fuel</span>
      </button>
      
      <button
        className={`bottom-nav-button ${currentPage === "groceries" ? "active" : ""}`}
        onClick={() => onNavigate("groceries")}
      >
        <div className="bottom-nav-icon">🛒</div>
        <span>Groceries</span>
      </button>

      <button
        className={`bottom-nav-button ${currentPage === "aianalysis" ? "active" : ""}`}
        onClick={() => onNavigate("aianalysis")}
      >
        <div className="bottom-nav-icon">🤖</div>
        <span>AI</span>
      </button>
    </nav>
  );
}

export default BottomNav;
