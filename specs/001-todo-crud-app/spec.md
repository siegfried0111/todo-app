# Feature Specification: Todo App with CRUD Operations

**Feature Branch**: `001-todo-crud-app`
**Created**: 2025-10-30
**Status**: Draft
**Input**: User description: "建立一個todo app，可以CRUD。可以總覽目前有哪些todo，包含已完成/進行中。每個todo要有標題，建立時間，內容。已完成的todo多增加完成時間。不管是否完成，都可以修改。刪除時，要有確認畫面，輸入DELETE，才可以進行刪除"

## Clarifications

### Session 2025-10-30

- Q: How should todos be organized in the overview display? → A: Sort by creation time (newest first), show in-progress and completed in separate sections
- Q: What are the maximum length constraints for title and content? → A: Title: 200 characters, Content: 10,000 characters
- Q: Should content field allow whitespace-only or empty input? → A: Allow whitespace-only or empty content (only title is required)
- Q: Can completed todos be reverted back to in-progress status? → A: Allow reverting completed todos back to in-progress (removes completion timestamp)
- Q: What is the expected data volume the system should handle? → A: Support up to 1,000 todos per user

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and View Todo Items (Priority: P1)

Users can create new todo items with a title and content, which are automatically timestamped. They can then view all their todos in an overview that shows the creation time for each item.

**Why this priority**: This is the foundational functionality that allows users to capture tasks. Without the ability to create and view todos, the app provides no value.

**Independent Test**: Can be fully tested by creating one or more todo items and verifying they appear in the overview with correct title, content, and creation timestamp.

**Acceptance Scenarios**:

1. **Given** the user is on the todo creation page, **When** they enter a title "Buy groceries" and content "Milk, eggs, bread" and submit, **Then** a new todo is created with the entered title, content, and current timestamp as creation time
2. **Given** the user has created multiple todos with different statuses, **When** they view the todo overview, **Then** in-progress todos are displayed in one section and completed todos in another section, each sorted by creation time (newest first), showing title, content, and creation time
3. **Given** the user submits a todo creation form, **When** the title field is empty, **Then** the system prevents creation and shows an error message

---

### User Story 2 - Mark Todos as Completed (Priority: P2)

Users can mark todo items as completed, which automatically records the completion time. Users can also revert completed todos back to in-progress status, which removes the completion timestamp. The overview displays both in-progress and completed todos, allowing users to see their full task history.

**Why this priority**: Tracking completion status is core to task management. Users need to distinguish between pending and finished work, and have flexibility to reopen tasks when needed.

**Independent Test**: Can be tested by creating a todo, marking it as completed, and verifying the completion timestamp is recorded and the status changes in the overview. Also test reverting a completed todo back to in-progress.

**Acceptance Scenarios**:

1. **Given** an in-progress todo exists, **When** the user marks it as completed, **Then** the todo's status changes to completed and a completion timestamp is recorded
2. **Given** a completed todo exists, **When** the user reverts it to in-progress, **Then** the todo's status changes to in-progress and the completion timestamp is removed
3. **Given** the user views the todo overview, **When** todos have different statuses, **Then** the system displays both in-progress and completed todos with their respective timestamps
4. **Given** a completed todo, **When** displayed in the overview, **Then** it shows both creation time and completion time

---

### User Story 3 - Edit Todo Items (Priority: P2)

Users can edit any todo item's title and content, regardless of whether it's marked as completed or in-progress. This allows users to update information as tasks evolve.

**Why this priority**: Real-world tasks change, and users need flexibility to update their todos without recreating them. This applies to both active and completed tasks.

**Independent Test**: Can be tested by creating a todo, editing its title and content, and verifying the changes are saved. Also test editing a completed todo to ensure status doesn't block editing.

**Acceptance Scenarios**:

1. **Given** an in-progress todo exists, **When** the user edits its title from "Meeting" to "Team Meeting" and content from "Discuss project" to "Discuss Q1 project goals", **Then** the changes are saved and displayed in the overview
2. **Given** a completed todo exists, **When** the user edits its title or content, **Then** the changes are saved while preserving the completed status and completion time
3. **Given** the user is editing a todo, **When** they clear the title field, **Then** the system prevents saving and shows an error message

---

### User Story 4 - Delete Todo Items with Confirmation (Priority: P3)

Users can delete todo items, but must confirm their intention by typing "DELETE" in a confirmation dialog. This prevents accidental data loss.

**Why this priority**: Deletion is a destructive action needed for cleanup, but requires safeguards. The explicit confirmation reduces user errors.

**Independent Test**: Can be tested by attempting to delete a todo, verifying the confirmation dialog appears, and checking that deletion only proceeds when "DELETE" is correctly entered.

**Acceptance Scenarios**:

1. **Given** a todo exists, **When** the user initiates deletion, **Then** a confirmation dialog appears asking them to type "DELETE"
2. **Given** the confirmation dialog is displayed, **When** the user types "DELETE" exactly and confirms, **Then** the todo is permanently removed from the system
3. **Given** the confirmation dialog is displayed, **When** the user types anything other than "DELETE" (e.g., "delete", "Delete", "yes"), **Then** the deletion is cancelled and the todo remains
4. **Given** the confirmation dialog is displayed, **When** the user cancels or closes the dialog without typing "DELETE", **Then** the deletion is cancelled and the todo remains

---

### Edge Cases

- System rejects todos with whitespace-only titles but allows whitespace-only or empty content
- System rejects titles exceeding 200 characters and content exceeding 10,000 characters with a validation error
- Marking an already-completed todo as completed again has no effect (idempotent operation)
- Marking an already in-progress todo as in-progress has no effect (idempotent operation)
- What happens if a user attempts to edit or delete a todo that has already been deleted by another concurrent action?
- How does the system display todos when the creation time and completion time are identical (completed within the same second)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create new todo items with a title and content
- **FR-002**: System MUST automatically record the creation timestamp when a todo is created
- **FR-003**: System MUST validate that todo titles are not empty or only whitespace before creation or update (content may be empty or whitespace-only)
- **FR-003a**: System MUST enforce a maximum length of 200 characters for todo titles
- **FR-003b**: System MUST enforce a maximum length of 10,000 characters for todo content
- **FR-004**: System MUST display an overview of all todos organized in two separate sections (in-progress and completed), with each section sorted by creation time (newest first), showing title, content, creation time, and status
- **FR-005**: System MUST allow users to mark in-progress todos as completed
- **FR-006**: System MUST automatically record the completion timestamp when a todo is marked as completed
- **FR-006a**: System MUST allow users to revert completed todos back to in-progress status
- **FR-006b**: System MUST remove the completion timestamp when a todo is reverted from completed to in-progress
- **FR-007**: System MUST display completion time for completed todos in addition to creation time
- **FR-008**: System MUST allow users to edit the title and content of any todo regardless of its status
- **FR-009**: System MUST preserve the original creation time when a todo is edited
- **FR-010**: System MUST preserve the completion status and completion time when editing completed todos
- **FR-011**: System MUST show a confirmation dialog when a user initiates todo deletion
- **FR-012**: System MUST require users to type exactly "DELETE" (case-sensitive) in the confirmation dialog to proceed with deletion
- **FR-013**: System MUST cancel deletion if the user enters any text other than "DELETE" or closes the confirmation dialog
- **FR-014**: System MUST permanently remove the todo when deletion is confirmed with correct input
- **FR-015**: System MUST persist all todo data so that todos are retained between sessions
- **FR-016**: System MUST support at least 1,000 todos per user without performance degradation

### Key Entities

- **Todo Item**: Represents a single task or reminder. Attributes include:
  - Title (required text, max 200 characters, cannot be empty or whitespace-only)
  - Content (optional text description, max 10,000 characters, may be empty)
  - Creation time (timestamp, auto-generated)
  - Status (in-progress or completed)
  - Completion time (timestamp, only present when status is completed)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new todo in under 30 seconds
- **SC-002**: Users can find and view any todo in the overview in under 10 seconds
- **SC-003**: Users can edit a todo's title or content in under 45 seconds
- **SC-004**: Users can successfully complete the deletion confirmation process in under 15 seconds
- **SC-005**: 100% of accidental deletion attempts are prevented by the confirmation mechanism (no deletions occur when user doesn't type "DELETE")
- **SC-006**: All todo data persists correctly with no data loss between sessions
- **SC-007**: Users can distinguish between in-progress and completed todos at a glance in the overview
- **SC-008**: System maintains all time-based success criteria (SC-001 through SC-004) when user has up to 1,000 todos
