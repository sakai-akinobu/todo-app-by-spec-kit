# Component Contracts: TODO Management Web Application

## Component Interface Specifications

### TodoList Component
**Purpose**: Main container component that displays filtered TODO items

```typescript
interface TodoListProps {
  todos: Todo[];
  filter: FilterStatus;
  onToggleComplete: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

interface TodoListState {
  // No local state - controlled component
}
```

**Behavior Contract**:
- MUST render empty state message when no todos match filter
- MUST apply filter before rendering todo items
- MUST handle loading state gracefully
- MUST propagate user actions via callbacks
- MUST NOT mutate todos prop directly

**Test Scenarios**:
- Renders empty state with "No todos" message
- Displays filtered todos correctly for each filter type
- Calls onToggleComplete when todo status changed
- Calls onDeleteTodo when delete action triggered
- Handles empty todos array without errors

### TodoItem Component
**Purpose**: Individual todo item display with interactive controls

```typescript
interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}
```

**Behavior Contract**:
- MUST display todo content text
- MUST show completion status visually (checkbox/strikethrough)
- MUST provide delete action button
- MUST call callbacks with correct todo ID
- MUST handle long content text with appropriate wrapping
- MUST apply 2000s styling (table layout, simple borders)

**Test Scenarios**:
- Renders todo content correctly
- Shows completed state with strikethrough/checked appearance
- Shows active state with normal appearance
- Delete button triggers onDelete with correct ID
- Toggle button triggers onToggleComplete with correct ID
- Handles very long content without breaking layout

### TodoForm Component
**Purpose**: Form for adding new todo items

```typescript
interface TodoFormProps {
  onAddTodo: (content: string) => void;
}

interface TodoFormState {
  inputValue: string;
  isSubmitting: boolean;
}
```

**Behavior Contract**:
- MUST validate input (non-empty, trimmed content)
- MUST clear form after successful submission
- MUST prevent submission of empty/whitespace-only content
- MUST handle Enter key submission
- MUST show validation errors to user
- MUST focus input field on mount

**Test Scenarios**:
- Submits valid todo content via onAddTodo callback
- Rejects empty string submission
- Rejects whitespace-only submission
- Clears input after successful submission
- Handles Enter key press for submission
- Maintains focus and accessibility

### FilterControls Component
**Purpose**: Filter buttons for showing different todo subsets

```typescript
interface FilterControlsProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  todoCounts: {
    all: number;
    active: number;
    completed: number;
  };
}
```

**Behavior Contract**:
- MUST display three filter options: All, Active, Completed
- MUST highlight currently active filter
- MUST show count for each filter category
- MUST call onFilterChange when filter selected
- MUST apply 2000s button styling (beveled, gradient backgrounds)

**Test Scenarios**:
- Renders all three filter buttons
- Shows correct active filter state
- Displays accurate counts for each filter
- Calls onFilterChange with correct filter value
- Handles zero counts gracefully

### Layout Component
**Purpose**: Main page layout with 2000s web aesthetic

```typescript
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}
```

**Behavior Contract**:
- MUST apply 2000s styling theme (gradients, table layouts, system fonts)
- MUST provide semantic HTML structure
- MUST be responsive for modern screen sizes
- MUST include proper page title and metadata
- MUST support keyboard navigation

**2000s Design Requirements**:
- Color scheme: Blue/silver gradients, bright accents
- Typography: Arial/Helvetica system fonts, bold headings
- Borders: Simple 1px borders, minimal rounded corners
- Buttons: Beveled appearance, gradient backgrounds
- Tables: Border-collapsed grid layout for content
- Background: Subtle gradient or pattern texture

**Test Scenarios**:
- Renders children content within layout
- Applies 2000s styling consistently
- Maintains responsive behavior
- Provides proper semantic structure

## Service Layer Contracts

### TodoStorage Service
**Purpose**: Handles localStorage operations for TODO persistence

```typescript
interface TodoStorage {
  loadTodos(): Promise<Todo[]>;
  saveTodos(todos: Todo[]): Promise<void>;
  isAvailable(): boolean;
}
```

**Behavior Contract**:
- MUST handle localStorage unavailability gracefully
- MUST validate data format when loading
- MUST provide error handling for quota exceeded
- MUST serialize/deserialize dates correctly
- MUST maintain data consistency

### TodoFilter Service
**Purpose**: Provides filtering logic for TODO lists

```typescript
interface TodoFilter {
  filterTodos(todos: Todo[], filter: FilterStatus): Todo[];
  getTodoCounts(todos: Todo[]): { all: number; active: number; completed: number };
}
```

**Behavior Contract**:
- MUST return filtered arrays without mutating original
- MUST handle empty arrays correctly
- MUST provide accurate counts for each filter type
- MUST maintain sort order (by creation date, newest first)

## Integration Points

### Component Hierarchy
```
App
├── Layout
│   ├── TodoForm
│   ├── FilterControls
│   └── TodoList
│       └── TodoItem (multiple)
```

### Data Flow
1. App component manages global TODO state
2. Form submissions bubble up through onAddTodo
3. Status changes bubble up through onToggleComplete
4. Deletions bubble up through onDeleteTodo
5. Filter changes update local filter state
6. Storage operations triggered on state changes

### Error Boundaries
- Components must handle prop validation errors
- Storage errors must not crash the application
- Missing data should show appropriate empty states
- Network/browser issues should degrade gracefully

This contract specification ensures all components work together cohesively while maintaining clear responsibilities and testable interfaces.