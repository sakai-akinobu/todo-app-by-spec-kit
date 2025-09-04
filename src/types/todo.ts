import { v4 as uuidv4 } from 'uuid'

/**
 * Todo item representing a single task
 */
export interface Todo {
  id: string          // Unique identifier (UUID v4)
  content: string     // Task description/content (1-500 characters)
  completed: boolean  // Task completion status
  createdAt: Date     // Creation timestamp
}

/**
 * Filter status for displaying TODO items
 */
export type FilterStatus = 'all' | 'completed' | 'active'

/**
 * Storage data structure for localStorage
 */
export interface StorageData {
  todos: Todo[]
  version: string
  lastUpdated: Date
}

/**
 * Validates if an object is a valid Todo
 */
export function isValidTodo(obj: any): obj is Todo {
  if (!obj || typeof obj !== 'object') return false
  
  // Validate id
  if (!obj.id || typeof obj.id !== 'string' || obj.id.trim().length === 0) {
    return false
  }
  
  // Validate content
  if (!obj.content || typeof obj.content !== 'string') {
    return false
  }
  
  const trimmedContent = obj.content.trim()
  if (trimmedContent.length === 0 || trimmedContent.length > 500) {
    return false
  }
  
  // Validate completed
  if (typeof obj.completed !== 'boolean') {
    return false
  }
  
  // Validate createdAt
  if (!obj.createdAt || !(obj.createdAt instanceof Date)) {
    return false
  }
  
  return true
}

/**
 * Validates if a string is a valid FilterStatus
 */
export function isValidFilterStatus(status: any): status is FilterStatus {
  return status === 'all' || status === 'completed' || status === 'active'
}

/**
 * Creates a new Todo item with generated UUID and current timestamp
 */
export function createTodo(content: string): Todo {
  const trimmedContent = content.trim()
  
  if (trimmedContent.length === 0 || trimmedContent.length > 500) {
    throw new Error('Todo content must be between 1 and 500 characters')
  }
  
  return {
    id: uuidv4(),
    content: trimmedContent,
    completed: false,
    createdAt: new Date()
  }
}