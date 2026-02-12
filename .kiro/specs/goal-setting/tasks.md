# Implementation Plan: Goal Setting Feature

## Overview

This implementation plan breaks down the Goal Setting feature into incremental coding tasks. Each task builds on previous work, starting with core data structures and basic UI, then adding persistence, AI insights, and advanced features like completion tracking and date management. The plan follows the existing SmartSave architecture patterns and integrates seamlessly with the current navigation system.

## Tasks

- [x] 1. Set up goal setting page structure and navigation
  - Create `src/pages/GoalSetting/` directory
  - Create `GoalSetting.jsx` and `GoalSetting.css` files
  - Add goals route to `App.jsx` navigation logic
  - Update `BottomNav.jsx` to include goals navigation button with icon
  - _Requirements: 5.2, 5.4, 6.1_

- [ ] 2. Implement core goal data model and state management
  - [ ] 2.1 Create goal object structure with all fields
    - Define goal interface with id, title, description, expectedSavings, targetDate, completed, completedAt, insight, createdAt
    - Initialize state for goals array, completedGoals array, and UI state flags
    - _Requirements: 1.1, 9.1, 10.1, 11.1_
  - [ ]\* 2.2 Write property test for goal object structure
    - **Property 30: Expected savings input in creation**
    - **Property 35: Target date input in creation**
    - **Validates: Requirements 10.1, 11.1**

- [ ] 3. Implement goal creation functionality
  - [ ] 3.1 Create goal input form UI
    - Add input field for goal title
    - Add optional input for expected savings amount
    - Add optional date picker for target date
    - Add submit button and form validation
    - _Requirements: 1.1, 10.1, 11.1_
  - [ ] 3.2 Implement handleCreateGoal function
    - Validate title is non-empty and not whitespace-only
    - Generate unique ID for new goal
    - Create goal object with all fields
    - Add to goals array
    - Clear input fields after creation
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ]\* 3.3 Write property tests for goal creation
    - **Property 1: Valid goal creation grows the list**
    - **Property 2: Whitespace-only titles are rejected**
    - **Validates: Requirements 1.1, 1.2, 1.3**

- [ ] 4. Implement goal list display
  - [ ] 4.1 Create GoalItem component structure
    - Create `src/pages/GoalSetting/components/GoalItem.jsx`
    - Create `src/pages/GoalSetting/components/GoalItem.css`
    - Define props interface for GoalItem
    - _Requirements: 1.5, 6.1_
  - [ ] 4.2 Implement default goal item view
    - Display goal title
    - Display expected savings if present (next to title)
    - Display target date if present
    - Add description indicator icon when description exists
    - Add dropdown button for AI insights
    - Add complete button
    - Add delete button
    - _Requirements: 1.5, 2.3, 7.4, 9.5, 10.2, 10.3, 11.2_
  - [ ]\* 4.3 Write property tests for goal display
    - **Property 6: Description indicator presence**
    - **Property 18: Delete control presence**
    - **Property 27: Complete control presence**
    - **Property 28: Expected savings display when present**
    - **Property 29: No savings display when absent**
    - **Property 32: Target date display when present**
    - **Validates: Requirements 2.3, 7.4, 9.5, 10.2, 10.3, 11.2**

- [ ] 5. Checkpoint - Ensure basic goal creation and display works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement local storage persistence
  - [ ] 6.1 Create storage utility functions
    - Implement saveGoals function to serialize and store goals
    - Implement loadGoals function to deserialize from storage
    - Implement saveCompletedGoals and loadCompletedGoals functions
    - Handle JSON parse errors gracefully
    - _Requirements: 1.4, 4.1, 4.2, 4.3_
  - [ ] 6.2 Integrate storage with goal operations
    - Call saveGoals after create, update, delete operations
    - Load goals on component mount
    - Initialize with empty array if storage is invalid
    - _Requirements: 1.4, 4.1, 4.2, 4.3_
  - [ ]\* 6.3 Write property tests for persistence
    - **Property 3: Goal persistence round-trip**
    - **Property 11: Invalid storage data initializes empty**
    - **Property 12: Storage load reconstructs goals**
    - **Validates: Requirements 1.4, 4.2, 4.3, 4.4**

- [ ] 7. Implement goal description editing
  - [ ] 7.1 Create edit mode UI in GoalItem
    - Add click handler to enter edit mode
    - Display textarea for description when editing
    - Display inputs for expected savings and target date
    - Add save and cancel buttons
    - _Requirements: 2.1, 10.4_
  - [ ] 7.2 Implement edit state management
    - Track editingGoalId in parent state
    - Implement handleSaveDescription to update goal
    - Implement handleCancel to revert changes
    - Persist changes to local storage on save
    - _Requirements: 2.2, 2.4, 2.5, 10.4_
  - [ ]\* 7.3 Write property tests for editing
    - **Property 4: Edit mode preserves original until save**
    - **Property 5: Cancel operation is idempotent**
    - **Property 23: Edit mode UI state transition**
    - **Property 31: Expected savings editable**
    - **Validates: Requirements 2.1, 2.4, 2.5, 10.4**

- [ ] 8. Implement goal deletion
  - [ ] 8.1 Create handleDeleteGoal function
    - Remove goal from goals array
    - Update local storage
    - _Requirements: 7.1, 7.2, 7.3_
  - [ ]\* 8.2 Write property tests for deletion
    - **Property 16: Goal deletion removes from list and display**
    - **Property 17: Deletion persists to storage**
    - **Validates: Requirements 7.1, 7.2, 7.3**

- [ ] 9. Checkpoint - Ensure CRUD operations work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement AI insight dropdown functionality
  - [ ] 10.1 Create dropdown expansion logic
    - Track expandedGoalId in state
    - Implement handleToggleInsight function
    - Ensure only one dropdown expanded at a time
    - _Requirements: 3.1, 3.3, 3.4_
  - [ ] 10.2 Create AI insight display UI
    - Add expandable panel in GoalItem
    - Display insight text when expanded
    - Display loading indicator during fetch
    - Display error message on failure
    - _Requirements: 3.2, 3.5, 8.2_
  - [ ]\* 10.3 Write property tests for dropdown behavior
    - **Property 7: Dropdown toggle round-trip**
    - **Property 8: Single expansion invariant**
    - **Property 9: Loading indicator during insight fetch**
    - **Property 10: Expanded panel displays insight**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [ ] 11. Implement AI insight generation
  - [ ] 11.1 Create fetchAIInsight function
    - Build request payload with goal title and description
    - Make API call to N8N webhook or new endpoint
    - Handle network errors and timeouts
    - Cache insight in goal object
    - Update local storage with cached insight
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [ ] 11.2 Integrate insight fetching with dropdown
    - Trigger fetch when dropdown expanded and no cached insight
    - Show loading state during fetch
    - Display insight when loaded
    - _Requirements: 8.3, 8.4_
  - [ ]\* 11.3 Write property tests for AI insights
    - **Property 19: AI request includes goal data**
    - **Property 20: Insight caching prevents redundant requests**
    - **Property 21: On-demand insight generation**
    - **Validates: Requirements 8.1, 8.3, 8.4**
  - [ ]\* 11.4 Write unit tests for error handling
    - Test network failure error message
    - Test timeout error message
    - Test invalid response handling
    - _Requirements: 8.2_

- [ ] 12. Implement goal completion functionality
  - [ ] 12.1 Create handleCompleteGoal function
    - Mark goal as completed with timestamp
    - Move goal from goals array to completedGoals array
    - Update local storage for both arrays
    - _Requirements: 9.1, 9.2_
  - [ ] 12.2 Create completed goals view UI
    - Add toggle button to show/hide completed goals
    - Display completed goals in separate section
    - Show completion date for each completed goal
    - Apply completed styling (strikethrough, badge)
    - _Requirements: 9.3, 9.4_
  - [ ]\* 12.3 Write property tests for goal completion
    - **Property 24: Goal completion moves to completed list**
    - **Property 25: Completed goals display**
    - **Property 26: Completion date display**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**

- [ ] 13. Implement target date indicators
  - [ ] 13.1 Create date comparison logic
    - Calculate days until target date
    - Determine if date is approaching (within 7 days)
    - Determine if date is overdue (past and not completed)
    - _Requirements: 11.3, 11.4_
  - [ ] 13.2 Add visual indicators to GoalItem
    - Display warning icon for approaching deadlines
    - Display overdue badge for past-due goals
    - Apply appropriate CSS classes
    - _Requirements: 11.3, 11.4_
  - [ ]\* 13.3 Write property tests for date indicators
    - **Property 33: Approaching deadline indicator**
    - **Property 34: Overdue indicator**
    - **Validates: Requirements 11.3, 11.4**

- [ ] 14. Implement navigation integration
  - [ ] 14.1 Wire up navigation in App.jsx
    - Add goals page to routing logic
    - Pass onNavigate prop to GoalSetting
    - _Requirements: 5.2, 5.3_
  - [ ] 14.2 Update BottomNav active state
    - Highlight goals button when currentPage is "goals"
    - _Requirements: 5.1_
  - [ ]\* 14.3 Write property tests for navigation
    - **Property 13: Navigation preserves state**
    - **Property 14: Active navigation state**
    - **Property 15: Navigation button triggers page change**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [ ] 15. Implement responsive styling
  - [ ] 15.1 Create mobile-first CSS
    - Style goal items as cards matching FinancialOverview pattern
    - Ensure proper spacing and typography
    - Add responsive breakpoints
    - Test on mobile viewport sizes (320px-768px)
    - _Requirements: 6.2, 6.3, 6.4_
  - [ ]\* 15.2 Write property test for responsive rendering
    - **Property 22: Responsive rendering without overflow**
    - **Validates: Requirements 6.3**

- [ ] 16. Final checkpoint - Integration testing
  - Ensure all tests pass, ask the user if questions arise.
  - Test complete user flow: create goal → add description → view insight → mark complete
  - Verify persistence across page refreshes
  - Verify navigation between pages preserves state

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation follows existing SmartSave patterns for consistency
