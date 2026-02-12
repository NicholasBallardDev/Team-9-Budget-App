import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import './Onboarding.css';

function Onboarding({ onComplete, isLoading }) {
  const [showLanding, setShowLanding] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    financialGoal: "",
    age: "",
    income: 50000,
    postcode: "",
    bank: "",
    bankConsent: false,
    goal: ""
  });
  const totalQuestions = 6;

  // Bank data with logos (using SVG data URLs for portability)
  const banks = [
    {
      name: "CommBank",
      value: "commbank",
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23FFCC00' width='100' height='100'/%3E%3Ctext x='50' y='60' font-family='Arial' font-size='40' font-weight='bold' fill='%23000' text-anchor='middle'%3ECBA%3C/text%3E%3C/svg%3E"
    },
    {
      name: "ANZ",
      value: "anz",
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23007DBB' width='100' height='100'/%3E%3Ctext x='50' y='60' font-family='Arial' font-size='36' font-weight='bold' fill='%23FFF' text-anchor='middle'%3EANZ%3C/text%3E%3C/svg%3E"
    },
    {
      name: "Westpac",
      value: "westpac",
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23DA1710' width='100' height='100'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='24' font-weight='bold' fill='%23FFF' text-anchor='middle'%3EWEST%3C/text%3E%3Ctext x='50' y='75' font-family='Arial' font-size='24' font-weight='bold' fill='%23FFF' text-anchor='middle'%3EPAC%3C/text%3E%3C/svg%3E"
    },
    {
      name: "NAB",
      value: "nab",
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23E30000' width='100' height='100'/%3E%3Ctext x='50' y='60' font-family='Arial' font-size='36' font-weight='bold' fill='%23FFF' text-anchor='middle'%3ENAB%3C/text%3E%3C/svg%3E"
    }
  ];

  const handleStartOnboarding = () => {
    setShowLanding(false);
  };

  const nextQuestion = () => {
    if (currentQuestion === 0 && !formData.name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (currentQuestion === 1 && !formData.financialGoal) {
      alert("Please select your primary goal");
      return;
    }
    if (currentQuestion === 2 && !formData.age) {
      alert("Please enter your age");
      return;
    }
    if (currentQuestion === 4 && !formData.postcode) {
      alert("Please enter your postcode");
      return;
    }
    if (currentQuestion === 5 && !formData.bank) {
      alert("Please select your bank");
      return;
    }
    if (currentQuestion === 5 && !formData.bankConsent) {
      alert("Please consent to linking your bank account");
      return;
    }
    
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(formData);
      navigate('/overview');
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Landing Page View
  if (showLanding) {
    return (
      <div className="landing-page">
        <div className="landing-overlay">
          {/* Header */}
          <div className="landing-header">
            <div className="app-logo">SS</div>
            <h1 className="app-title">SmartSave</h1>
          </div>

          {/* Hero Content */}
          <div className="landing-content">
            <div className="hero-section">
              <h1 className="hero-title">Take Control of Your Money</h1>
              <p className="hero-subtitle">
                Smart budgeting and savings made simple. Track your spending, find better deals, and reach your financial goals faster.
              </p>

              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-icon">💰</span>
                  <span className="feature-text">Track spending effortlessly</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span className="feature-text">Set and achieve savings goals</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span className="feature-text">Get personalized insights</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔍</span>
                  <span className="feature-text">Find the best local deals</span>
                </div>
              </div>

              <button className="cta-button" onClick={handleStartOnboarding}>
                Get Started - It's Free
              </button>

              <p className="trust-badge">
                🔒 Bank-level security • Your data stays private
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="piggy-bank piggy-1">🐷</div>
          <div className="piggy-bank piggy-2">🐷</div>
          <div className="piggy-bank piggy-3">🐷</div>
          <div className="money-note note-1">💵</div>
          <div className="money-note note-2">💵</div>
          <div className="money-note note-3">💵</div>
          <div className="money-note note-4">💶</div>
          <div className="money-note note-5">💷</div>
        </div>
      </div>
    );
  }

  // Onboarding Questions View
  return (
    <div className={`onboarding question-${currentQuestion}`}>
      {/* Header */}
      <div className="onboarding-header">
        <div className="app-logo">SS</div>
        <h1 className="app-title">SmartSave</h1>
      </div>

      {/* Progress */}
      <ProgressBar current={currentQuestion + 1} total={totalQuestions} />

      {/* Question Content */}
      <div className="question-content">
        {/* Question 0: Name */}
        {currentQuestion === 0 && (
          <div className="question-card">
            <h2 className="question-title">What's your name?</h2>
            <p className="question-subtitle">Let's personalize your experience</p>

            <input
              type="text"
              className="text-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sarah"
            />
          </div>
        )}

        {/* Question 1: Financial Goal */}
        {currentQuestion === 1 && (
          <div className="question-card">
            <h2 className="question-title">What's your primary goal?</h2>
            <p className="question-subtitle">Choose what matters most to you right now</p>

            <div className="options-vertical">
              <button
                className={`option-button ${formData.financialGoal === "budgeting" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, financialGoal: "budgeting" })}
              >
                <span className="option-icon">📊</span>
                <span className="option-content">
                  <strong>Budgeting</strong>
                  <span className="option-description">Track and control spending</span>
                </span>
              </button>
              <button
                className={`option-button ${formData.financialGoal === "saving" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, financialGoal: "saving" })}
              >
                <span className="option-icon">🎯</span>
                <span className="option-content">
                  <strong>Saving</strong>
                  <span className="option-description">Build towards a goal</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Question 2: Age */}
        {currentQuestion === 2 && (
          <div className="question-card">
            <h2 className="question-title">How old are you?</h2>
            <p className="question-subtitle">This helps us personalize your savings recommendations</p>

            <input
              type="number"
              className="text-input"
              value={formData.age}
              onChange={e => setFormData({ ...formData, age: e.target.value })}
              placeholder="e.g. 28"
            />
          </div>
        )}

        {/* Question 3: Income Slider */}
        {currentQuestion === 3 && (
          <div className="question-card">
            <h2 className="question-title">What's your annual income?</h2>
            <p className="question-subtitle">Slide to your approximate income range</p>

            <div className="income-display">
              <div className="income-value">${formData.income.toLocaleString()}</div>
              <input
                type="range"
                className="income-slider"
                min="20000"
                max="200000"
                step="5000"
                value={formData.income}
                onChange={e => setFormData({ ...formData, income: parseInt(e.target.value) })}
                style={{
                  background: `linear-gradient(to right, #16a34a 0%, #16a34a ${((formData.income - 20000) / (200000 - 20000)) * 100}%, #e5e7eb ${((formData.income - 20000) / (200000 - 20000)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="income-range">
                <span>$20k</span>
                <span>$200k</span>
              </div>
            </div>
          </div>
        )}

        {/* Question 4: Postcode */}
        {currentQuestion === 4 && (
          <div className="question-card">
            <h2 className="question-title">What's your postcode?</h2>
            <p className="question-subtitle">We'll use this to find the best deals near you</p>

            <input
              type="number"
              className="text-input"
              value={formData.postcode}
              onChange={e => setFormData({ ...formData, postcode: e.target.value })}
              placeholder="e.g. 3000"
            />
          </div>
        )}

        {/* Question 5: Bank Selection */}
        {currentQuestion === 5 && (
          <div className="question-card">
            <h2 className="question-title">Connect your bank</h2>
            <p className="question-subtitle">Select your bank to analyze your spending (using demo data)</p>

            <div className="options-grid bank-grid">
              {banks.map(bank => (
                <button
                  key={bank.value}
                  className={`option-button bank-option ${formData.bank === bank.value ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, bank: bank.value })}
                >
                  <img src={bank.logo} alt={bank.name} className="bank-logo" />
                  <span className="bank-name">{bank.name}</span>
                </button>
              ))}
            </div>

            <div className="bank-consent">
              <label className="consent-checkbox">
                <input
                  type="checkbox"
                  checked={formData.bankConsent}
                  onChange={e => setFormData({ ...formData, bankConsent: e.target.checked })}
                />
                <div className="checkbox-custom"></div>
                <span className="consent-text">
                  I consent to linking my bank account to SmartSave for analyzing my spending patterns. My data will be kept secure and private.
                </span>
              </label>
            </div>

            <div className="goal-input">
              <label className="goal-label">Optional: What are you saving for?</label>
              <input
                type="text"
                className="text-input-small"
                value={formData.goal}
                onChange={e => setFormData({ ...formData, goal: e.target.value })}
                placeholder="e.g. Buy a car, Emergency fund, Travel"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="onboarding-nav">
        {currentQuestion > 0 && (
          <button className="nav-button secondary" onClick={previousQuestion}>
            ← Back
          </button>
        )}
        <button
          className={`nav-button primary ${currentQuestion === 0 ? "full-width" : ""}`}
          onClick={nextQuestion}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              Analyzing
              <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </>
          ) : currentQuestion === totalQuestions - 1 ? "Get My Insights →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
