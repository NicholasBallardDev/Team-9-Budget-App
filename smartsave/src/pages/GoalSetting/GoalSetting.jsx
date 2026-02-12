import { useState } from 'react';
import './GoalSetting.css';
import GoalItem from './components/GoalItem';

/**
 * Goal object structure:
 * {
 *   id: string,              // Unique identifier (timestamp or UUID)
 *   title: string,           // Goal title (required, non-empty)
 *   description: string,     // Optional detailed description
 *   expectedSavings: number | null, // Optional monetary amount
 *   targetDate: string | null,      // Optional ISO date string (YYYY-MM-DD)
 *   completed: boolean,      // Completion status
 *   completedAt: number | null,     // Completion timestamp
 *   insight: string | null,  // Cached AI insight (null if not yet generated)
 *   createdAt: number        // Creation timestamp
 * }
 */

function GoalSetting() {
  // Core data state
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Save for vacation to Japan',
      description: 'Planning a 2-week trip to Tokyo and Kyoto. Need to cover flights, accommodation, and daily expenses.',
      expectedSavings: 5000,
      targetDate: '2026-06-15',
      completed: false,
      completedAt: null,
      insight: 'Based on your current spending patterns, you can reach this goal by saving $500 per month. Consider reducing dining out expenses by 20% to accelerate your savings.',
      createdAt: Date.now() - 86400000 * 30
    },
    {
      id: '2',
      title: 'Emergency fund',
      description: 'Build 6 months of living expenses as a safety net.',
      expectedSavings: 15000,
      targetDate: '2026-12-31',
      completed: false,
      completedAt: null,
      insight: null,
      createdAt: Date.now() - 86400000 * 20
    },
    {
      id: '3',
      title: 'New laptop for work',
      description: '',
      expectedSavings: 2000,
      targetDate: '2026-02-20',
      completed: false,
      completedAt: null,
      insight: null,
      createdAt: Date.now() - 86400000 * 10
    },
    {
      id: '4',
      title: 'Pay off credit card debt',
      description: 'Clear remaining balance on credit card to improve credit score.',
      expectedSavings: 3500,
      targetDate: '2026-02-10',
      completed: false,
      completedAt: null,
      insight: 'You\'re making great progress! Focus on paying more than the minimum to reduce interest charges.',
      createdAt: Date.now() - 86400000 * 5
    },
    {
      id: '5',
      title: 'Start investing',
      description: '',
      expectedSavings: null,
      targetDate: null,
      completed: false,
      completedAt: null,
      insight: null,
      createdAt: Date.now() - 86400000 * 2
    }
  ]);
  const [completedGoals, setCompletedGoals] = useState([]);
  
  // UI state flags
  const [showCompleted, setShowCompleted] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [expandedGoalId, setExpandedGoalId] = useState(null);
  const [loadingInsightId, setLoadingInsightId] = useState(null);

  // Form input state
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalSavings, setNewGoalSavings] = useState('');
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('');

  /**
   * Creates a new goal with validation
   * Requirements: 1.1, 1.2, 1.3
   */
  const handleCreateGoal = () => {
    // Validate title is non-empty and not whitespace-only
    const trimmedTitle = newGoalTitle.trim();
    if (!trimmedTitle) {
      return; // Prevent creation of invalid goals
    }

    // Generate unique ID
    const newGoal = {
      id: Date.now().toString(),
      title: trimmedTitle,
      description: '',
      expectedSavings: newGoalSavings ? parseFloat(newGoalSavings) : null,
      targetDate: newGoalTargetDate || null,
      completed: false,
      completedAt: null,
      insight: null,
      createdAt: Date.now()
    };

    // Add to goals array
    setGoals([...goals, newGoal]);

    // Clear input fields after creation
    setNewGoalTitle('');
    setNewGoalSavings('');
    setNewGoalTargetDate('');
  };

  /**
   * Handlers for GoalItem component
   */
  const handleEdit = (id) => {
    setEditingGoalId(id);
  };

  const handleSaveDescription = (id, description) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, description } : goal
    ));
    setEditingGoalId(null);
  };

  const handleCancel = () => {
    setEditingGoalId(null);
  };

  const handleDelete = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleComplete = (id) => {
    const goalToComplete = goals.find(goal => goal.id === id);
    if (goalToComplete) {
      const completedGoal = {
        ...goalToComplete,
        completed: true,
        completedAt: Date.now()
      };
      setCompletedGoals([...completedGoals, completedGoal]);
      setGoals(goals.filter(goal => goal.id !== id));
    }
  };

  const handleToggleInsight = (id) => {
    if (expandedGoalId === id) {
      setExpandedGoalId(null);
    } else {
      setExpandedGoalId(id);
      // TODO: Fetch AI insight if not cached (Task 11)
    }
  };

  const handleUpdateSavings = (id, amount) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, expectedSavings: amount } : goal
    ));
  };

  const handleUpdateTargetDate = (id, date) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, targetDate: date } : goal
    ));
  };

  return (
    <div className="goal-setting">
      <div className="goal-header">
        <h1 className="goal-title">My john</h1>
        <p className="goal-subtitle">Track your financial goals</p>
      </div>
      

      {/* Goal Creation Form */}
      <div className="goal-form">
        <input
          type="text"
          className="goal-input"
          placeholder="Enter your goal title"
          value={newGoalTitle}
          onChange={(e) => setNewGoalTitle(e.target.value)}
        />
        
        <div className="goal-form-optional">
          <input
            type="number"
            className="goal-input-savings"
            placeholder="Expected savings ($)"
            value={newGoalSavings}
            onChange={(e) => setNewGoalSavings(e.target.value)}
            min="0"
            step="0.01"
          />
          
          <input
            type="date"
            className="goal-input-date"
            placeholder="Target date"
            value={newGoalTargetDate}
            onChange={(e) => setNewGoalTargetDate(e.target.value)}
          />
        </div>

        <button 
          className="goal-submit-btn"
          onClick={handleCreateGoal}
        >
          Add Goal
        </button>
      </div>

      {/* Goal List */}
      <div className="goal-list">
        {goals.length === 0 && (
          <p className="no-goals-message">No goals yet. Create your first goal above!</p>
        )}
        {goals.map(goal => (
          <GoalItem
            key={goal.id}
            goal={goal}
            isEditing={editingGoalId === goal.id}
            isExpanded={expandedGoalId === goal.id}
            isLoadingInsight={loadingInsightId === goal.id}
            onEdit={handleEdit}
            onSave={handleSaveDescription}
            onCancel={handleCancel}
            onDelete={handleDelete}
            onComplete={handleComplete}
            onToggleInsight={handleToggleInsight}
            onUpdateSavings={handleUpdateSavings}
            onUpdateTargetDate={handleUpdateTargetDate}
          />
        ))}
        
      </div>

    </div>
    
  );
}

export default GoalSetting;
