import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import './Onboarding.css';

function Onboarding({ onComplete, isLoading }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    financialGoal: "",
    age: "",
    income: 50000,
    postcode: "",
    bank: "",
    goal: ""
  });
  const totalQuestions = 5;

  const nextQuestion = () => {
    if (currentQuestion === 0 && !formData.financialGoal) {
      alert("Please select your primary goal");
      return;
    }
    if (currentQuestion === 1 && !formData.age) {
      alert("Please enter your age");
      return;
    }
    if (currentQuestion === 3 && !formData.postcode) {
      alert("Please enter your postcode");
      return;
    }
    if (currentQuestion === 4 && !formData.bank) {
      alert("Please select your bank");
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

  return (
    <div className="onboarding">
      {/* Header */}
      <div className="onboarding-header">
        <div className="app-logo">SS</div>
        <h1 className="app-title">SmartSave</h1>
      </div>

      {/* Progress */}
      <ProgressBar current={currentQuestion + 1} total={totalQuestions} />

      {/* Question Content */}
      <div className="question-content">
        {/* Question 0: Financial Goal */}
        {currentQuestion === 0 && (
          <div className="question-card">
            <h2 className="question-title">What's your primary goal?</h2>
            <p className="question-subtitle">Choose what matters most to you right now</p>

            <div className="options-vertical">
              <button
                className={`option-button ${formData.financialGoal === "budgeting" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, financialGoal: "budgeting" })}
              >
                Budgeting - Track and control spending
              </button>
              <button
                className={`option-button ${formData.financialGoal === "saving" ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, financialGoal: "saving" })}
              >
                Saving - Build towards a goal
              </button>
            </div>
          </div>
        )}

        {/* Question 1: Age */}
        {currentQuestion === 1 && (
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

        {/* Question 2: Income Slider */}
        {currentQuestion === 2 && (
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

        {/* Question 3: Postcode */}
        {currentQuestion === 3 && (
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

        {/* Question 4: Bank Selection */}
        {currentQuestion === 4 && (
          <div className="question-card">
            <h2 className="question-title">Connect your bank</h2>
            <p className="question-subtitle">Select your bank to analyze your spending (using demo data)</p>

            <div className="options-grid">
              {["CommBank", "ANZ", "Westpac", "NAB"].map(bank => (
                <button
                  key={bank}
                  className={`option-button ${formData.bank === bank.toLowerCase() ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, bank: bank.toLowerCase() })}
                >
                  {bank}
                </button>
              ))}
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
          {isLoading ? "Analyzing..." : currentQuestion === totalQuestions - 1 ? "Get My Insights →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
