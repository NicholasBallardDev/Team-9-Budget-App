import './InsightPopup.css';

function InsightPopup({ insight, onClose }) {
  return (
    <div className="insight-overlay">
      <div className="insight-popup">
        <div className="insight-icon">💡</div>
        <p className="insight-message">{insight}</p>
        <button className="insight-button" onClick={onClose}>
          See Your Overview →
        </button>
      </div>
    </div>
  );
}

export default InsightPopup;
