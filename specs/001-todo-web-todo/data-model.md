# Data Model: Personal TODO Management Web Application

## Core Entities

### Todo Item
**Purpose**: Represents a single task/item in the user's TODO list

```typescript
interface Todo {
  id: string;          // Unique identifier (UUID v4)
  content: string;     // Task description/content (1-500 characters)
  completed: boolean;  // Task completion status
  createdAt: Date;     // Creation timestamp
}
```

**Validation Rules**:
- `id`: Must be unique, non-empty string (UUID format preferred)
- `content`: Required, 1-500 characters, no leading/trailing whitespace
- `completed`: Boolean value (defaults to false)  
- `createdAt`: Valid Date object, immutable after creation

**State Transitions**:
- `created` → `completed`: User marks task as done
- `completed` → `created`: User marks task as not done
- `any` → `deleted`: User removes task (permanent deletion)

### Filter State
**Purpose**: Represents the current view filter for displaying TODO items

```typescript
type FilterStatus = 'all' | 'completed' | 'active';

interface FilterState {
  status: FilterStatus;  // Current filter selection
}
```

**Filter Logic**:
- `all`: Show all TODO items regardless of completion status
- `completed`: Show only items where `completed === true`
- `active`: Show only items where `completed === false`

## Data Storage Schema

### localStorage Structure
**Key**: `todos-app-data`  
**Format**: JSON serialized object

```typescript
interface StorageData {
  todos: Todo[];
  version: string;     // Data schema version for future migrations
  lastUpdated: Date;   // Last modification timestamp
}
```

### Example Storage Data
```json
{
  "todos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "content": "Complete project documentation",
      "completed": false,
      "createdAt": "2025-09-03T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001", 
      "content": "Review pull requests",
      "completed": true,
      "createdAt": "2025-09-03T09:30:00.000Z"
    }
  ],
  "version": "1.0.0",
  "lastUpdated": "2025-09-03T10:15:00.000Z"
}
```

## Business Rules

### Creation Rules
- New TODO items default to `completed: false`
- Content must be trimmed of leading/trailing whitespace
- Duplicate content is allowed (different tasks may have same description)
- Maximum 1000 TODO items per user (soft limit with warning)

### Update Rules
- Only `completed` status and `content` can be modified after creation
- `id` and `createdAt` are immutable
- Content updates preserve creation date
- Status changes are immediate (no confirmation required)

### Deletion Rules
- Deletion is permanent with no undo functionality
- All TODO items can be cleared via bulk action
- Deletion confirmation required for bulk operations only

### Filter Rules
- Filter state persists in component state (not localStorage)
- Default filter is 'all' on application startup
- Filter applies immediately without user confirmation
- Empty states show appropriate messaging per filter type

## Data Migration Strategy

### Version Management
- Data schema version stored in localStorage
- Future versions can implement migration functions
- Corrupted/invalid data falls back to empty state

### Error Handling
- localStorage unavailable: Show warning, disable persistence
- Invalid JSON: Reset to empty state with user notification  
- Missing required fields: Attempt repair or skip invalid entries
- Quota exceeded: Show error, prevent new additions

## Performance Considerations

### Data Operations
- All operations are synchronous (localStorage is sync API)
- Filter operations use Array.filter (acceptable for <1000 items)
- No pagination needed for typical personal use cases
- TODO rendering optimized with React.memo

### Storage Efficiency
- JSON serialization is compact and human-readable
- Date objects serialized as ISO strings
- No unnecessary metadata stored
- Periodic cleanup of old completed items (user-initiated)

This data model provides a simple yet robust foundation for personal TODO management with clear validation rules and error handling strategies.