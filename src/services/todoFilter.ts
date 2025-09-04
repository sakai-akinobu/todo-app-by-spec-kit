import { Todo, FilterStatus } from '@/types/todo'

/**
 * Filter todos based on completion status
 * Returns a new array without mutating the original
 */
export function filterTodos(todos: Todo[], filter: FilterStatus): Todo[] {
  // Sort by creation date (newest first) before filtering
  const sortedTodos = [...todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  
  switch (filter) {
    case 'all':
      return sortedTodos
    case 'active':
      return sortedTodos.filter(todo => !todo.completed)
    case 'completed':
      return sortedTodos.filter(todo => todo.completed)
    default:
      return sortedTodos
  }
}

/**
 * Get count of todos for each filter type
 * Returns object with counts for all, active, and completed todos
 */
export function getTodoCounts(todos: Todo[]): { all: number; active: number; completed: number } {
  return {
    all: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length
  }
}

/**
 * Sort todos by creation date (newest first)
 * Returns a new array without mutating the original
 */
export function sortTodosByDate(todos: Todo[], descending: boolean = true): Todo[] {
  return [...todos].sort((a, b) => {
    const diff = a.createdAt.getTime() - b.createdAt.getTime()
    return descending ? -diff : diff
  })
}

/**
 * Find todo by ID
 */
export function findTodoById(todos: Todo[], id: string): Todo | undefined {
  return todos.find(todo => todo.id === id)
}

/**
 * Check if any todos match the search term in content
 */
export function searchTodos(todos: Todo[], searchTerm: string): Todo[] {
  if (!searchTerm.trim()) {
    return todos
  }
  
  const term = searchTerm.toLowerCase().trim()
  return todos.filter(todo => 
    todo.content.toLowerCase().includes(term)
  )
}