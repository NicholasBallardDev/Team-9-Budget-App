import { useState } from "react";
import "./GoalSetting.css";
import GoalItem from "./components/GoalItem";
import SavingsSummary from "./components/SavingsSummary";
import AIGoalSummary from "./components/AIGoalSummary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Goal object structure:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   expectedSavings: number | null,
 *   targetDate: string | null,
 *   completed: boolean,
 *   completedAt: number | null,
 *   insight: string | null,
 *   createdAt: number
 * }
 */

function GoalSetting({ formData, insights }) {
  // =============================
  // STATE
  // =============================

  const [goals, setGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [weeklySavings, setWeeklySavings] = useState(0);

  const [showCompleted, setShowCompleted] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [expandedGoalId, setExpandedGoalId] = useState(null);
  const [loadingInsightId, setLoadingInsightId] = useState(null);

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalSavings, setNewGoalSavings] = useState("");
  const [newGoalTargetDate, setNewGoalTargetDate] = useState("");

  // =============================
  // AI INSIGHT FETCH (n8n)
  // =============================

  const fetchInsightForGoal = async (goalId, goal) => {
    setLoadingInsightId(goalId);

    try {
      const income = formData?.income || 60000;
      const monthlyExpenses = 3000;

      const response = await fetch("/api/n8n/webhook/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId: goal.id,
          title: goal.title,
          description: goal.description || "",
          expectedSavings: goal.expectedSavings,
          targetDate: goal.targetDate,
          userProfile: {
            income,
            monthlyExpenses,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId ? { ...g, insight: data.insight } : g
        )
      );
    } catch (error) {
      console.error("Insight error:", error);

      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId
            ? {
                ...g,
                insight:
                  "Unable to generate insight at this time. Click again to retry.",
              }
            : g
        )
      );
    } finally {
      setLoadingInsightId(null);
    }
  };

  // =============================
  // CREATE GOAL (Manual)
  // =============================

  const handleCreateGoal = async () => {
    const trimmedTitle = newGoalTitle.trim();
    if (!trimmedTitle) return;

    const newGoal = {
      id: Date.now().toString(),
      title: trimmedTitle,
      description: "",
      expectedSavings: newGoalSavings
        ? parseFloat(newGoalSavings)
        : null,
      targetDate: newGoalTargetDate || null,
      completed: false,
      completedAt: null,
      insight: null,
      createdAt: Date.now(),
    };

    setGoals((prev) => [...prev, newGoal]);

    setNewGoalTitle("");
    setNewGoalSavings("");
    setNewGoalTargetDate("");

    if (newGoal.expectedSavings && newGoal.targetDate) {
      await fetchInsightForGoal(newGoal.id, newGoal);
    }
  };

  // =============================
  // AI QUICK GOALS
  // =============================

  const handleAddQuickGoal = (quickGoal) => {
    const newGoal = {
      id: Date.now().toString(),
      title: quickGoal.title,
      description: quickGoal.description || "",
      expectedSavings: quickGoal.expectedSavings || null,
      targetDate: null,
      completed: false,
      completedAt: null,
      insight: null,
      createdAt: Date.now(),
    };

    setGoals((prev) => [...prev, newGoal]);
  };

  // =============================
  // GOAL ACTIONS
  // =============================

  const handleEdit = (id) => {
    setEditingGoalId(id);
  };

  const handleUpdateGoal = (id, updates) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      )
    );
    setEditingGoalId(null);
  };

  const handleDelete = (id) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    setCompletedGoals((prev) =>
      prev.filter((goal) => goal.id !== id)
    );
  };

  const handleComplete = (id) => {
    const goalToComplete = goals.find((goal) => goal.id === id);
    if (!goalToComplete) return;

    const completedGoal = {
      ...goalToComplete,
      completed: true,
      completedAt: Date.now(),
    };

    if (goalToComplete.expectedSavings) {
      setWeeklySavings(
        (prev) => prev + goalToComplete.expectedSavings
      );
    }

    setCompletedGoals((prev) => [...prev, completedGoal]);
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const handleToggleInsight = async (id) => {
    if (expandedGoalId === id) {
      setExpandedGoalId(null);
      return;
    }

    setExpandedGoalId(id);

    const goal = goals.find((g) => g.id === id);
    if (goal && !goal.insight) {
      await fetchInsightForGoal(id, goal);
    }
  };

  // =============================
  // UI
  // =============================

  return (
    <div className="goal-setting">
      <div className="goal-header">
        <h1 className="goal-title">My Goals</h1>
        <p className="goal-subtitle">
          Track and achieve your financial goals
        </p>
      </div>

      <SavingsSummary weeklySavings={weeklySavings} />
      <ToastContainer position="top-right" autoClose={3000} />

      <AIGoalSummary
        onAddGoal={handleAddQuickGoal}
        categories={insights?.categories}
      />

      {/* Create Goal */}
      <div className="goal-form">
        <input
          type="text"
          placeholder="Enter your goal title"
          value={newGoalTitle}
          onChange={(e) => setNewGoalTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Expected savings ($)"
          value={newGoalSavings}
          onChange={(e) => setNewGoalSavings(e.target.value)}
        />

        <input
          type="date"
          value={newGoalTargetDate}
          onChange={(e) => setNewGoalTargetDate(e.target.value)}
        />

        <button onClick={handleCreateGoal}>
          Add Goal
        </button>
      </div>

      {/* Active Goals */}
      <div className="goal-list">
        {goals.map((goal) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            isEditing={editingGoalId === goal.id}
            isExpanded={expandedGoalId === goal.id}
            isLoadingInsight={loadingInsightId === goal.id}
            onEdit={handleEdit}
            onSave={handleUpdateGoal}
            onDelete={handleDelete}
            onComplete={handleComplete}
            onToggleInsight={handleToggleInsight}
          />
        ))}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="completed-section">
          <button
            onClick={() =>
              setShowCompleted(!showCompleted)
            }
          >
            {showCompleted ? "Hide" : "Show"} Completed (
            {completedGoals.length})
          </button>

          {showCompleted &&
            completedGoals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                isExpanded={expandedGoalId === goal.id}
                onDelete={handleDelete}
                onToggleInsight={handleToggleInsight}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default GoalSetting;
