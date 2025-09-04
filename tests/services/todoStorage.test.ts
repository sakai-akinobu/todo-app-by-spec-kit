import { describe, test, expect, beforeEach, vi } from 'vitest'
import { TodoStorage } from '@/services/todoStorage'
import { Todo } from '@/types/todo'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

vi.stubGlobal('localStorage', localStorageMock)

describe('TodoStorage Service Tests', () => {
  let todoStorage: TodoStorage
  const mockTodos: Todo[] = [
    {
      id: '1',
      content: 'Test todo 1',
      completed: false,
      createdAt: new Date('2025-09-03T10:00:00.000Z')
    },
    {
      id: '2', 
      content: 'Test todo 2',
      completed: true,
      createdAt: new Date('2025-09-03T11:00:00.000Z')
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    todoStorage = new TodoStorage()
  })

  describe('loadTodos', () => {
    test('should return empty array when localStorage is empty', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      const todos = await todoStorage.loadTodos()

      expect(todos).toEqual([])
      expect(localStorageMock.getItem).toHaveBeenCalledWith('todos-app-data')
    })

    test('should return parsed todos from localStorage', async () => {
      const storageData = {
        todos: mockTodos,
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storageData))

      const todos = await todoStorage.loadTodos()

      expect(todos).toHaveLength(2)
      expect(todos[0].content).toBe('Test todo 1')
      expect(todos[1].completed).toBe(true)
    })

    test('should handle corrupted JSON gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')

      const todos = await todoStorage.loadTodos()

      expect(todos).toEqual([])
    })

    test('should validate todo data and filter invalid items', async () => {
      const storageData = {
        todos: [
          mockTodos[0],
          { id: '', content: 'Invalid todo', completed: false }, // Invalid - empty ID
          mockTodos[1]
        ],
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storageData))

      const todos = await todoStorage.loadTodos()

      expect(todos).toHaveLength(2) // Only valid todos
      expect(todos[0].id).toBe('1')
      expect(todos[1].id).toBe('2')
    })
  })

  describe('saveTodos', () => {
    test('should save todos to localStorage with correct format', async () => {
      await todoStorage.saveTodos(mockTodos)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'todos-app-data',
        expect.stringContaining('"todos":')
      )

      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1])
      expect(savedData.todos).toHaveLength(2)
      expect(savedData.todos[0].content).toBe('Test todo 1')
      expect(savedData.todos[1].content).toBe('Test todo 2')
      expect(savedData.version).toBe('1.0.0')
      expect(savedData.lastUpdated).toBeDefined()
    })

    test('should handle localStorage quota exceeded error', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new DOMException('QuotaExceededError')
      })

      await expect(todoStorage.saveTodos(mockTodos)).rejects.toThrow('Storage quota exceeded')
    })
  })

  describe('isAvailable', () => {
    test('should return true when localStorage is available', () => {
      expect(todoStorage.isAvailable()).toBe(true)
    })

    test('should return false when localStorage is not available', () => {
      vi.stubGlobal('localStorage', undefined)
      const storageWithoutLS = new TodoStorage()

      expect(storageWithoutLS.isAvailable()).toBe(false)
    })
  })

  describe('clearAll', () => {
    test('should remove todos data from localStorage', async () => {
      // Mock that localStorage is available
      vi.stubGlobal('localStorage', localStorageMock)
      
      await todoStorage.clearAll()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('todos-app-data')
    })
  })

  describe('data migration', () => {
    test('should handle missing version field', async () => {
      // Convert mockTodos to simulate stored format (createdAt as string)
      const todosAsStored = mockTodos.map(todo => ({
        ...todo,
        createdAt: todo.createdAt.toISOString()
      }))
      const oldFormatData = { todos: todosAsStored } // Missing version and lastUpdated
      localStorageMock.getItem.mockReturnValue(JSON.stringify(oldFormatData))

      const todos = await todoStorage.loadTodos()

      expect(todos).toHaveLength(2)
      expect(todos[0].id).toBe('1')
      expect(todos[1].id).toBe('2')
      expect(todos[0].createdAt).toBeInstanceOf(Date)
      expect(todos[1].createdAt).toBeInstanceOf(Date)
    })
  })
})