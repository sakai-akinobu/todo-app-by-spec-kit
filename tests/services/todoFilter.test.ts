import { describe, test, expect } from 'vitest'
import { filterTodos, getTodoCounts } from '@/services/todoFilter'
import { Todo, FilterStatus } from '@/types/todo'

describe('TodoFilter Utility Tests', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      content: 'Active todo 1',
      completed: false,
      createdAt: new Date('2025-09-03T10:00:00.000Z')
    },
    {
      id: '2',
      content: 'Completed todo 1', 
      completed: true,
      createdAt: new Date('2025-09-03T11:00:00.000Z')
    },
    {
      id: '3',
      content: 'Active todo 2',
      completed: false,
      createdAt: new Date('2025-09-03T12:00:00.000Z')
    },
    {
      id: '4',
      content: 'Completed todo 2',
      completed: true,
      createdAt: new Date('2025-09-03T13:00:00.000Z')
    }
  ]

  describe('filterTodos', () => {
    test('should return all todos for "all" filter', () => {
      const filtered = filterTodos(mockTodos, 'all')
      
      expect(filtered).toHaveLength(4)
      // Should be sorted by creation date, newest first
      expect(filtered[0].id).toBe('4') // Newest (13:00)
      expect(filtered[1].id).toBe('3') // 12:00  
      expect(filtered[2].id).toBe('2') // 11:00
      expect(filtered[3].id).toBe('1') // Oldest (10:00)
    })

    test('should return only active todos for "active" filter', () => {
      const filtered = filterTodos(mockTodos, 'active')
      
      expect(filtered).toHaveLength(2)
      expect(filtered[0].completed).toBe(false)
      expect(filtered[1].completed).toBe(false)
      // Sorted by creation date, newest first
      expect(filtered[0].content).toBe('Active todo 2') // id: 3 (12:00)
      expect(filtered[1].content).toBe('Active todo 1') // id: 1 (10:00)
    })

    test('should return only completed todos for "completed" filter', () => {
      const filtered = filterTodos(mockTodos, 'completed')
      
      expect(filtered).toHaveLength(2)
      expect(filtered[0].completed).toBe(true)
      expect(filtered[1].completed).toBe(true)
      // Sorted by creation date, newest first
      expect(filtered[0].content).toBe('Completed todo 2') // id: 4 (13:00)
      expect(filtered[1].content).toBe('Completed todo 1') // id: 2 (11:00)
    })

    test('should handle empty array gracefully', () => {
      const filtered = filterTodos([], 'all')
      expect(filtered).toEqual([])
    })

    test('should not mutate original array', () => {
      const original = [...mockTodos]
      const filtered = filterTodos(mockTodos, 'active')
      
      expect(mockTodos).toEqual(original)
      expect(filtered).not.toBe(mockTodos)
    })

    test('should maintain creation date order (newest first)', () => {
      const filtered = filterTodos(mockTodos, 'all')
      
      // Should be ordered by creation date, newest first
      expect(filtered[0].createdAt.getTime()).toBeGreaterThan(filtered[1].createdAt.getTime())
      expect(filtered[1].createdAt.getTime()).toBeGreaterThan(filtered[2].createdAt.getTime())
      expect(filtered[2].createdAt.getTime()).toBeGreaterThan(filtered[3].createdAt.getTime())
    })
  })

  describe('getTodoCounts', () => {
    test('should return correct counts for all filter types', () => {
      const counts = getTodoCounts(mockTodos)
      
      expect(counts).toEqual({
        all: 4,
        active: 2,
        completed: 2
      })
    })

    test('should handle empty array', () => {
      const counts = getTodoCounts([])
      
      expect(counts).toEqual({
        all: 0,
        active: 0,
        completed: 0
      })
    })

    test('should handle all active todos', () => {
      const allActiveTodos: Todo[] = [
        {
          id: '1',
          content: 'Active todo 1',
          completed: false,
          createdAt: new Date()
        },
        {
          id: '2', 
          content: 'Active todo 2',
          completed: false,
          createdAt: new Date()
        }
      ]
      
      const counts = getTodoCounts(allActiveTodos)
      
      expect(counts).toEqual({
        all: 2,
        active: 2,
        completed: 0
      })
    })

    test('should handle all completed todos', () => {
      const allCompletedTodos: Todo[] = [
        {
          id: '1',
          content: 'Completed todo 1',
          completed: true,
          createdAt: new Date()
        },
        {
          id: '2',
          content: 'Completed todo 2', 
          completed: true,
          createdAt: new Date()
        }
      ]
      
      const counts = getTodoCounts(allCompletedTodos)
      
      expect(counts).toEqual({
        all: 2,
        active: 0,
        completed: 2
      })
    })
  })
})