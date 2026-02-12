import { useState } from "react"
import "./GoalItem.css"

/**
 * GoalItem Component
 *
 * Displays an individual goal with all its details and controls.
 * Supports multiple view modes: default, editing, expanded.
 *
 * Props:
 * - goal: Goal object with all fields
 * - isEditing: Boolean indicating if this goal is in edit mode
 * - isExpanded: Boolean indicating if AI insight panel is expanded
 * - isLoadingInsight: Boolean indicating if AI insight is being fetched
 * - onEdit: Function to enter edit mode
 * - onSave: Function to save all goal updates from the edit form
 * - onCancel: Function to cancel editing
 * - onDelete: Function to delete the goal
 * - onComplete: Function to mark goal as completed
 * - onToggleInsight: Function to expand/collapse AI insight panel
 */
function GoalItem({
  goal,
  isEditing,
  isExpanded,
  isLoadingInsight,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onComplete,
  onToggleInsight,
}) {
  const [editDescription, setEditDescription] = useState(goal.description)
  const [editSavings, setEditSavings] = useState(goal.expectedSavings || "")
  const [editTargetDate, setEditTargetDate] = useState(goal.targetDate || "")

  const handleSave = () => {
    onSave(goal.id, {
      description: editDescription,
      expectedSavings: editSavings ? parseFloat(editSavings) : null,
      targetDate: editTargetDate || null,
    })
  }

  const handleCancel = () => {
    setEditDescription(goal.description)
    setEditSavings(goal.expectedSavings || "")
    setEditTargetDate(goal.targetDate || "")
    onCancel()
  }

  // Format target date for display
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Check if target date is approaching (within 7 days)
  const isApproaching = () => {
    if (!goal.targetDate || goal.completed) return false
    const target = new Date(goal.targetDate)
    const now = new Date()
    const diffTime = target - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7
  }

  // Check if target date is overdue
  const isOverdue = () => {
    if (!goal.targetDate || goal.completed) return false
    const target = new Date(goal.targetDate)
    const now = new Date()
    return target < now
  }

  // Default view (not editing)
  if (!isEditing) {
    return (
      <div className={`goal-item ${goal.completed ? "completed" : ""}`}>
        <div className="goal-item-header">
          <div className="goal-item-title-row">
            <h3 className="goal-item-title">{goal.title}</h3>
            {goal.expectedSavings && (
              <span className="goal-item-savings">
                ${goal.expectedSavings.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description Preview */}
          {goal.description && (
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: "4px 0 8px 0",
                color: "#6c757d",
                fontSize: "14px",
              }}
            >
              {goal.description}
            </p>
          )}

          {goal.targetDate && (
            <div className="goal-item-date-row">
              <span
                className={`goal-item-date ${isOverdue() ? "overdue" : isApproaching() ? "approaching" : ""}`}
              >
                {isOverdue() && <span className="date-icon">⚠️</span>}
                {isApproaching() && !isOverdue() && (
                  <span className="date-icon">⏰</span>
                )}
                Due: {formatDate(goal.targetDate)}
              </span>
            </div>
          )}
        </div>

        <div className="goal-item-controls">
          {!goal.completed && (
            <>
              <button
                className="goal-item-btn goal-item-btn-edit"
                onClick={() => onEdit(goal.id)}
                title="Edit goal"
              >
                {goal.description ? "📝" : "➕"}{" "}
                {goal.description ? "Edit" : "Add Details"}
              </button>

              <button
                className="goal-item-btn goal-item-btn-insight"
                onClick={() => onToggleInsight(goal.id)}
                title="View AI insights"
              >
                💡 Insights
              </button>

              <button
                className="goal-item-btn goal-item-btn-complete"
                onClick={() => onComplete(goal.id)}
                title="Mark as completed"
              >
                ✓ Complete
              </button>
            </>
          )}

          {/* Delete is always available */}
          <button
            className="goal-item-btn goal-item-btn-delete"
            onClick={() => onDelete(goal.id)}
            title="Delete goal"
          >
            🗑️
          </button>
        </div>

        {/* AI Insight Dropdown Panel */}
        {isExpanded && (
          <div className="goal-item-insight-panel">
            {isLoadingInsight ? (
              <div className="insight-loading">
                <div className="loading-spinner"></div>
                <p>Generating insights...</p>
              </div>
            ) : goal.insight ? (
              <div className="insight-content">
                <p>{goal.insight}</p>
              </div>
            ) : (
              <div className="insight-error">
                <p>No insight available yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Editing view
  return (
    <div className="goal-item goal-item-editing">
      <div className="goal-item-header">
        <h3 className="goal-item-title">{goal.title}</h3>
      </div>

      <div className="goal-item-edit-form">
        <label className="edit-label">Description</label>
        <textarea
          className="goal-item-textarea"
          placeholder="Add details about your goal..."
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          rows={4}
        />

        <div className="edit-form-row">
          <div className="edit-form-field">
            <label className="edit-label">Expected Savings ($)</label>
            <input
              type="number"
              className="goal-item-input"
              placeholder="0.00"
              value={editSavings}
              onChange={(e) => setEditSavings(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="edit-form-field">
            <label className="edit-label">Target Date</label>
            <input
              type="date"
              className="goal-item-input"
              value={editTargetDate}
              onChange={(e) => setEditTargetDate(e.target.value)}
            />
          </div>
        </div>

        <div className="goal-item-edit-controls">
          <button
            className="goal-item-btn goal-item-btn-save"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="goal-item-btn goal-item-btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default GoalItem
