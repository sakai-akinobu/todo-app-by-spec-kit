import { describe, test, expect } from 'vitest'
import { Todo, FilterStatus, isValidTodo, createTodo, isValidFilterStatus } from '@/types/todo'

describe('Todo Type Tests', () => {
  describe('Todo interface', () => {
    test('should validate a valid Todo object', () => {
      const validTodo: Todo = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        content: 'Test todo item',
        completed: false,
        createdAt: new Date('2025-09-03T10:00:00.000Z')
      }

      expect(isValidTodo(validTodo)).toBe(true)
    })

    test('should reject Todo with invalid id', () => {
      const invalidTodo = {
        id: '', // Empty ID should be invalid
        content: 'Test todo item',
        completed: false,
        createdAt: new Date()
      }

      expect(isValidTodo(invalidTodo)).toBe(false)
    })

    test('should reject Todo with invalid content', () => {
      const invalidTodo = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        content: '', // Empty content should be invalid
        completed: false,
        createdAt: new Date()
      }

      expect(isValidTodo(invalidTodo)).toBe(false)
    })

    test('should reject Todo with content too long', () => {
      const invalidTodo = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        content: 'a'.repeat(501), // Over 500 character limit
        completed: false,
        createdAt: new Date()
      }

      expect(isValidTodo(invalidTodo)).toBe(false)
    })

    test('should trim whitespace from content', () => {
      const todo = createTodo('  Test todo with whitespace  ')
      expect(todo.content).toBe('Test todo with whitespace')
    })
  })

  describe('FilterStatus type', () => {
    test('should validate "all" filter status', () => {
      expect(isValidFilterStatus('all')).toBe(true)
    })

    test('should validate "completed" filter status', () => {
      expect(isValidFilterStatus('completed')).toBe(true)
    })

    test('should validate "active" filter status', () => {
      expect(isValidFilterStatus('active')).toBe(true)
    })

    test('should reject invalid filter status', () => {
      expect(isValidFilterStatus('invalid' as FilterStatus)).toBe(false)
    })
  })

  describe('createTodo function', () => {
    test('should create a valid Todo with UUID', () => {
      const todo = createTodo('Test todo creation')

      expect(todo.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      expect(todo.content).toBe('Test todo creation')
      expect(todo.completed).toBe(false)
      expect(todo.createdAt).toBeInstanceOf(Date)
    })

    test('should create todos with unique IDs', () => {
      const todo1 = createTodo('First todo')
      const todo2 = createTodo('Second todo')

      expect(todo1.id).not.toBe(todo2.id)
    })

    test('should set completed to false by default', () => {
      const todo = createTodo('New todo')
      expect(todo.completed).toBe(false)
    })
  })
})