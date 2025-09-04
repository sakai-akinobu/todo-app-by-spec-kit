import { Todo, StorageData, isValidTodo } from '@/types/todo'

/**
 * TodoStorage service handles localStorage operations for TODO data
 * Provides methods to load, save, and manage TODO items persistence
 */
export class TodoStorage {
  private readonly STORAGE_KEY = 'todos-app-data'
  private readonly CURRENT_VERSION = '1.0.0'

  /**
   * Load todos from localStorage
   * Returns empty array if no data exists or data is corrupted
   */
  async loadTodos(): Promise<Todo[]> {
    try {
      if (!this.isAvailable()) {
        return []
      }

      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) {
        return []
      }

      const parsed: StorageData = JSON.parse(data)
      
      if (!parsed.todos || !Array.isArray(parsed.todos)) {
        return []
      }

      // Validate and filter valid todos, convert createdAt strings back to Date objects
      const validTodos = parsed.todos
        .map(todo => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }))
        .filter(isValidTodo)

      return validTodos
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error)
      return []
    }
  }

  /**
   * Save todos to localStorage with metadata
   */
  async saveTodos(todos: Todo[]): Promise<void> {
    try {
      if (!this.isAvailable()) {
        throw new Error('localStorage is not available')
      }

      const storageData: StorageData = {
        todos,
        version: this.CURRENT_VERSION,
        lastUpdated: new Date()
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageData))
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded')
      }
      if (error instanceof Error && error.message === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded')
      }
      throw error
    }
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && 
             typeof localStorage !== 'undefined' &&
             localStorage !== null
    } catch {
      return false
    }
  }

  /**
   * Clear all todos from localStorage
   */
  async clearAll(): Promise<void> {
    if (!this.isAvailable()) {
      return
    }

    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear todos from localStorage:', error)
      throw error
    }
  }

  /**
   * Get storage metadata (version, last updated)
   */
  async getStorageInfo(): Promise<{ version?: string; lastUpdated?: Date } | null> {
    try {
      if (!this.isAvailable()) {
        return null
      }

      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) {
        return null
      }

      const parsed: StorageData = JSON.parse(data)
      return {
        version: parsed.version,
        lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : undefined
      }
    } catch (error) {
      console.error('Failed to get storage info:', error)
      return null
    }
  }
}