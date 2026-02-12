# Design Document: Goal Setting Feature

## Overview

The Goal Setting feature is implemented as a new page component within the SmartSave React application. It follows the existing architectural patterns: a page component in `src/pages/GoalSetting/` with separate JSX and CSS files, integration with the BottomNav component for navigation, and local storage for data persistence.

The feature consists of three main interaction flows:

1. Creating and displaying goals in a list
2. Adding/editing descriptions by clicking on goal items
3. Expanding dropdown panels to view AI-generated insights

The design leverages React hooks for state management and follows the component-based architecture established in the existing codebase.

## Architecture

### Component Structure

```
GoalSetting/
├── GoalSetting.jsx       # Main page component
├── GoalSetting.css       # Page styles
└── components/
    ├── GoalItem.jsx      # Individual goal display component
    └── GoalItem.css      # Goal item styles
```

### State Management

The GoalSetting page manages the following state:

- `goals`: Array of active (not completed) goal objects
- `completedGoals`: Array of completed goal objects
- `showCompleted`: Boolean to toggle completed goals view
- `editingGoalId`: ID of the goal currently being edited (null if none)
- `expandedGoalId`: ID of the goal with expanded AI insight panel (null if none)
- `loadingInsightId`: ID of the goal currently loading AI insight (null if none)
- 'isCompleted': Boolean representing if the goal has been completed

### Data Flow

1. **Initialization**: On mount, load goals from local storage
2. **Goal Creation**: User input → validate → add to state → persist to local storage
3. **Description Editing**: Click goal → show edit UI → save → update state → persist
4. **AI Insights**: Click dropdown → fetch insight → cache in goal object → display

### Integration Points

- **App.jsx**: Add "goals" page to navigation routing
- **BottomNav.jsx**: Add goals navigation button
- **Local Storage**: Key `smartsave_goals` for persistence
- **AI Service**: Reuse existing N8N webhook pattern or create new endpoint

## Components and Interfaces

### GoalSetting Component

**Props:**

- `onNavigate`: Function to handle navigation to other pages

**State:**

```javascript
{
  goals: [
    {
      id: string,              // Unique identifier (timestamp or UUID)
      title: string,           // Goal title
      description: string,     // Optional detailed description
      expectedSavings: number | null, // Optional monetary amount
      targetDate: string | null,      // Optional ISO date string
      completed: boolean,      // Completion status
      completedAt: number | null,     // Completion timestamp
      insight: string,         // Cached AI insight (null if not yet generated)
      createdAt: number        // Timestamp
    }
  ],
  completedGoals: [],          // Array of completed goals
  showCompleted: boolean,      // Toggle for completed goals view
  editingGoalId: string | null,
  expandedGoalId: string | null,
  loadingInsightId: string | null
}
```

**Key Methods:**

- `handleCreateGoal(title, expectedSavings, targetDate)`: Validates and creates new goal
- `handleDeleteGoal(id)`: Removes goal from list
- `handleCompleteGoal(id)`: Marks goal as completed and moves to completed list
- `handleSaveDescription(id, description)`: Updates goal description
- `handleUpdateGoal(id, updates)`: Updates goal fields (expectedSavings, targetDate)
- `handleToggleInsight(id)`: Expands/collapses AI insight panel
- `fetchAIInsight(goal)`: Requests AI insight from backend
- `toggleCompletedView()`: Shows/hides completed goals section

### GoalItem Component

**Props:**

```javascript
{
  goal: {
    id: string,
    title: string,
    description: string,
    expectedSavings: number | null,
    targetDate: string | null,
    completed: boolean,
    completedAt: number | null,
    insight: string,
    createdAt: number
  },
  isEditing: boolean,
  isExpanded: boolean,
  isLoadingInsight: boolean,
  onEdit: (id) => void,
  onSave: (id, description) => void,
  onCancel: () => void,
  onDelete: (id) => void,
  onComplete: (id) => void,
  onToggleInsight: (id) => void,
  onUpdateSavings: (id, amount) => void,
  onUpdateTargetDate: (id, date) => void
}
```

**Rendering Logic:**

- Default view: Display title, expected savings (if set), target date (if set), description indicator, dropdown button, complete button, delete button
- Editing view: Display title, textarea for description, inputs for expected savings and target date, save/cancel buttons
- Expanded view: Display title, description, AI insight panel
- Completed view: Display title with completion badge, completion date, strikethrough styling

## Data Models

### Goal Object

```javascript
{
  id: string,              // Unique identifier (Date.now().toString() or crypto.randomUUID())
  title: string,           // Required, non-empty
  description: string,     // Optional, defaults to empty string
  expectedSavings: number | null, // Optional monetary amount
  targetDate: string | null,      // Optional ISO date string (YYYY-MM-DD)
  completed: boolean,      // Completion status, defaults to false
  completedAt: number | null,     // Timestamp when completed, null if not completed
  insight: string | null,  // Cached AI insight, null until generated
  createdAt: number        // Timestamp for sorting
}
```

### Local Storage Schema

**Key:** `smartsave_goals`

**Value:** JSON string of goals array

```json
[
  {
    "id": "1234567890",
    "title": "Save for vacation",
    "description": "Planning a trip to Japan in 2025",
    "expectedSavings": 5000,
    "targetDate": "2025-06-01",
    "completed": false,
    "completedAt": null,
    "insight": "Based on your income, you can save $500/month...",
    "createdAt": 1234567890000
  }
]
```

**Key:** `smartsave_completed_goals`

**Value:** JSON string of completed goals array

```json
[
  {
    "id": "9876543210",
    "title": "Emergency fund",
    "description": "Build 3 months of expenses",
    "expectedSavings": 10000,
    "targetDate": "2024-12-31",
    "completed": true,
    "completedAt": 1735689600000,
    "insight": "Great job! You've built a solid safety net.",
    "createdAt": 1704067200000
  }
]
```

### AI Insight Request

**Endpoint:** TBD (follow existing N8N pattern or create new)

**Payload:**

```javascript
{
  sessionId: string,
  goalTitle: string,
  goalDescription: string,
  userContext: {
    income: number,
    age: number,
    financialGoal: string
  }
}
```

**Response:**

```javascript
{
  insight: string; // AI-generated advice text
}
```

## Error Handling

### Input Validation

- Empty goal titles: Prevent creation, show visual feedback (red border or shake animation)
- Whitespace-only titles: Treat as empty, prevent creation
- Maximum title length: 100 characters (soft limit with visual indicator)
- Maximum description length: 500 characters (soft limit with visual indicator)

### Local Storage Errors

- Parse errors: Log error, initialize with empty array
- Storage quota exceeded: Show user-friendly message, prevent new goals
- Storage unavailable: Show warning, operate in memory-only mode

### AI Insight Errors

- Network failure: Display "Unable to generate insight. Please try again."
- Timeout: Display "Insight generation is taking longer than expected."
- Invalid response: Display "Unable to generate insight at this time."
- Rate limiting: Display "Too many requests. Please wait a moment."

### Error Recovery

- All errors are non-fatal and allow continued use of the feature
- Failed AI insights can be retried by collapsing and re-expanding
- Local storage failures fall back to in-memory state

## Testing Strategy

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage.

### Unit Testing Approach

Unit tests focus on:

- Specific user interaction examples (creating a goal, editing description)
- Edge cases (empty inputs, storage errors, network failures)
- Component rendering states (editing mode, expanded mode, loading states)
- Integration with local storage and navigation

### Property-Based Testing Approach

Property-based tests validate universal correctness properties across randomized inputs. Each test should run a minimum of 100 iterations to ensure thorough coverage.

**Testing Library:** Use `fast-check` for JavaScript/React property-based testing

**Test Configuration:**

- Minimum 100 iterations per property test
- Each test tagged with: `Feature: goal-setting, Property {N}: {property text}`
- Generate random goal objects with varying titles, descriptions, and states

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system - essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Valid goal creation grows the list

_For any_ valid (non-empty) goal title, creating a goal should result in the goal list length increasing by one and the new goal appearing in the rendered list.

**Validates: Requirements 1.1, 1.3, 1.5**

### Property 2: Whitespace-only titles are rejected

_For any_ string composed entirely of whitespace characters, attempting to create a goal should be rejected, and the goal list should remain unchanged.

**Validates: Requirements 1.2**

### Property 3: Goal persistence round-trip

_For any_ valid goal object (with title, description, and other fields), serializing to local storage then deserializing should produce an equivalent goal object with all fields preserved.

**Validates: Requirements 1.4, 2.2, 4.4**

### Property 4: Edit mode preserves original until save

_For any_ goal with a description, entering edit mode and modifying the description should not change the stored description until save is explicitly called.

**Validates: Requirements 2.4**

### Property 5: Cancel operation is idempotent

_For any_ goal being edited, canceling the edit operation should restore the original description state, and multiple cancels should have the same effect as a single cancel.

**Validates: Requirements 2.5**

### Property 6: Description indicator presence

_For any_ goal with a non-empty description, the rendered goal item should contain a visual indicator element (such as an icon or badge) signaling that a description exists.

**Validates: Requirements 2.3**

### Property 7: Dropdown toggle round-trip

_For any_ goal, expanding the dropdown panel and then collapsing it should return the UI to its original collapsed state.

**Validates: Requirements 3.1, 3.3**

### Property 8: Single expansion invariant

_For any_ application state with multiple goals, at most one goal should have its dropdown panel in the expanded state at any given time.

**Validates: Requirements 3.4**

### Property 9: Loading indicator during insight fetch

_For any_ goal that is currently fetching an AI insight, the rendered output should contain a loading indicator element.

**Validates: Requirements 3.5**

### Property 10: Expanded panel displays insight

_For any_ goal with an expanded dropdown panel and a cached insight, the rendered output should contain the insight text.

**Validates: Requirements 3.2**

### Property 11: Invalid storage data initializes empty

_For any_ invalid JSON string or malformed data in local storage, loading the goal list should result in an empty array without throwing errors.

**Validates: Requirements 4.3**

### Property 12: Storage load reconstructs goals

_For any_ valid goal list stored in local storage, loading the page should reconstruct and display all goals with their complete data.

**Validates: Requirements 4.2**

### Property 13: Navigation preserves state

_For any_ goal list state, navigating away from the goal setting page and then navigating back should preserve the complete goal list without data loss.

**Validates: Requirements 5.3**

### Property 14: Active navigation state

_For any_ application state where currentPage equals "goals", the rendered BottomNav component should display the goals button with an active CSS class.

**Validates: Requirements 5.1**

### Property 15: Navigation button triggers page change

_For any_ application state, clicking the goals navigation button should invoke the onNavigate callback with the argument "goals".

**Validates: Requirements 5.2**

### Property 16: Goal deletion removes from list and display

_For any_ goal in the goal list, triggering the delete action should reduce the list length by one, remove the goal from the array, and remove it from the rendered output.

**Validates: Requirements 7.1, 7.3**

### Property 17: Deletion persists to storage

_For any_ goal that is deleted, the goal should no longer appear in local storage after the deletion operation completes.

**Validates: Requirements 7.2**

### Property 18: Delete control presence

_For any_ rendered goal item, the output should contain a delete button or control element.

**Validates: Requirements 7.4**

### Property 19: AI request includes goal data

_For any_ goal, when generating an AI insight request, the request payload should include both the goal's title and description fields.

**Validates: Requirements 8.1**

### Property 20: Insight caching prevents redundant requests

_For any_ goal with a cached insight, expanding the dropdown panel multiple times should only trigger one AI insight request (idempotence).

**Validates: Requirements 8.3**

### Property 21: On-demand insight generation

_For any_ goal without a cached insight, expanding the dropdown panel should trigger an AI insight request.

**Validates: Requirements 8.4**

### Property 22: Responsive rendering without overflow

_For any_ viewport width between 320px and 768px (mobile range), the goal setting page should render without horizontal scrollbars or content overflow.

**Validates: Requirements 6.3**

### Property 23: Edit mode UI state transition

_For any_ goal, clicking on the goal item should transition the UI state to editing mode, displaying a textarea for the description.

**Validates: Requirements 2.1**

### Property 24: Goal completion moves to completed list

_For any_ active goal, marking it as completed should remove it from the active goals array, add it to the completed goals array, and preserve all goal data including the new completion timestamp.

**Validates: Requirements 9.1, 9.2**

### Property 25: Completed goals display

_For any_ set of completed goals, when the completed goals view is shown, all completed goals should appear in the rendered output.

**Validates: Requirements 9.3**

### Property 26: Completion date display

_For any_ completed goal, the rendered output should contain the completion date formatted in a human-readable format.

**Validates: Requirements 9.4**

### Property 27: Complete control presence

_For any_ active (non-completed) goal item, the rendered output should contain a complete button or control element.

**Validates: Requirements 9.5**

### Property 28: Expected savings display when present

_For any_ goal with a non-null expectedSavings value, the rendered goal item should display the savings amount next to the goal title.

**Validates: Requirements 10.2**

### Property 29: No savings display when absent

_For any_ goal with null expectedSavings, the rendered goal item should display the title without a savings amount indicator.

**Validates: Requirements 10.3**

### Property 30: Expected savings input in creation

_For any_ goal creation operation, the interface should include an input field for expected savings, and the provided value should be stored in the goal object.

**Validates: Requirements 10.1**

### Property 31: Expected savings editable

_For any_ goal in edit mode, the interface should include an input field for updating the expected savings amount, and changes should be persisted when saved.

**Validates: Requirements 10.4**

### Property 32: Target date display when present

_For any_ goal with a non-null targetDate, the rendered goal item should display the date in a readable format (e.g., "Due: Jan 15, 2025").

**Validates: Requirements 11.2**

### Property 33: Approaching deadline indicator

_For any_ goal with a targetDate within 7 days of the current date and not completed, the rendered goal item should contain a visual indicator (such as a warning icon or highlighted date).

**Validates: Requirements 11.3**

### Property 34: Overdue indicator

_For any_ goal with a targetDate in the past and completed status false, the rendered goal item should display an overdue indicator.

**Validates: Requirements 11.4**

### Property 35: Target date input in creation

_For any_ goal creation operation, the interface should include a date input field for target date, and the provided value should be stored in the goal object.

**Validates: Requirements 11.1**
