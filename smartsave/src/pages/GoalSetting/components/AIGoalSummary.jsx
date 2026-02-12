import React, { useState } from "react"
import "./AIGoalSummary.css"
import { toast } from "react-toastify"

const QUICK_GOALS = [
  {
    title: "Build a $500 emergency fund",
    description:
      "A small emergency fund can cover unexpected expenses without derailing your budget.",
    expectedSavings: 500,
  },
  {
    title: "Save $100 on groceries this month",
    description:
      "Use the grocery comparison tool to find cheaper alternatives and stick to a shopping list.",
    expectedSavings: 100,
  },
  {
    title: "Cut one subscription service",
    description:
      "Review your monthly subscriptions and cancel one you don't use often. This is a quick win for monthly savings.",
    expectedSavings: 15, // An average
  },
]

function AIGoalSummary({ onAddGoal, categories }) {
  const [quickGoals, setQuickGoals] = useState(QUICK_GOALS)

  const handleAddQuickGoal = (goalToAdd) => {
    onAddGoal(goalToAdd)
    toast.success(`Added: "${goalToAdd.title}"`)
    setQuickGoals((prevQuickGoals) =>
      prevQuickGoals.filter((goal) => goal.title !== goalToAdd.title),
    )
  }

  const getIntroMessage = () => {
    if (!categories || categories.length === 0) {
      return "Recently there has been a 50% increase in your spending for groceries and subscriptions lately. Lets help with that!"
    }

    // Find a high-spending, actionable category
    const actionableCategories = categories
      .filter(
        (cat) =>
          !["Income", "Housing", "Rent"].includes(cat.name) && cat.total > 0,
      )
      .sort((a, b) => b.total - a.total)

    if (actionableCategories.length > 0) {
      const topCategory = actionableCategories[0]
      return `We have seen that you have been spending $${Math.round(
        topCategory.total,
      )} in the ${
        topCategory.name
      } category. Here are some goals that could help you save.`
    }

    return "Here are some quick, actionable goals to get you started."
  }

  return (
    <div className="ai-goal-summary">
      <div className="ai-summary-header">
        <span className="ai-icon">🤖</span>
        <h3>AI Goal Suggestions</h3>
      </div>
      <p className="ai-summary-intro">{getIntroMessage()}</p>
      {quickGoals.length > 0 && (
        <div className="quick-goals-list">
          {quickGoals.map((goal) => (
            <div key={goal.title} className="quick-goal-item">
              <div className="quick-goal-info">
                <h4>{goal.title}</h4>
                <p>{goal.description}</p>
              </div>
              <button
                className="add-quick-goal-btn"
                onClick={() => handleAddQuickGoal(goal)}
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AIGoalSummary
