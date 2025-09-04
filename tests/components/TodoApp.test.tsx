import React from 'react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TodoApp } from '@/components/TodoApp'

// Mock the storage service
vi.mock('@/services/todoStorage', () => ({
  TodoStorage: vi.fn().mockImplementation(() => ({
    loadTodos: vi.fn().mockResolvedValue([]),
    saveTodos: vi.fn().mockResolvedValue(undefined),
    clearAll: vi.fn().mockResolvedValue(undefined),
    isAvailable: vi.fn().mockReturnValue(true),
    getStorageInfo: vi.fn().mockResolvedValue({ version: '1.0.0', lastUpdated: new Date() })
  }))
}))

describe('TodoApp Component Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render all main components', () => {
    render(<TodoApp />)
    
    // Header
    expect(screen.getByText('📝 レトロTODOアプリ')).toBeInTheDocument()
    
    // Input section
    expect(screen.getByPlaceholderText('新しいTODOを入力...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
    
    // Filters
    expect(screen.getByText(/すべて/)).toBeInTheDocument()
    expect(screen.getByText(/未完了/)).toBeInTheDocument()
    expect(screen.getByText(/完了済み/)).toBeInTheDocument()
    
    // Empty state message
    expect(screen.getByText('TODOがありません')).toBeInTheDocument()
  })

  test('should add new todo when form is submitted', async () => {
    render(<TodoApp />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const addButton = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: 'New test todo' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('New test todo')).toBeInTheDocument()
    })
    
    // Input should be cleared
    expect(input).toHaveValue('')
  })

  test('should toggle todo completion status', async () => {
    render(<TodoApp />)
    
    // Add a todo first
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    fireEvent.change(input, { target: { value: 'Test todo' } })
    fireEvent.click(screen.getByRole('button', { name: '追加' }))
    
    await waitFor(() => {
      expect(screen.getByText('Test todo')).toBeInTheDocument()
    })
    
    // Toggle to completed
    const completeButton = screen.getByRole('button', { name: '完了' })
    fireEvent.click(completeButton)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '未完了' })).toBeInTheDocument()
    })
    
    // Toggle back to active
    const incompleteButton = screen.getByRole('button', { name: '未完了' })
    fireEvent.click(incompleteButton)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '完了' })).toBeInTheDocument()
    })
  })

  test('should delete todo when delete button is clicked', async () => {
    render(<TodoApp />)
    
    // Add a todo first
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    fireEvent.change(input, { target: { value: 'Todo to delete' } })
    fireEvent.click(screen.getByRole('button', { name: '追加' }))
    
    await waitFor(() => {
      expect(screen.getByText('Todo to delete')).toBeInTheDocument()
    })
    
    // Delete the todo
    const deleteButton = screen.getByRole('button', { name: '削除' })
    fireEvent.click(deleteButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument()
      expect(screen.getByText('TODOがありません')).toBeInTheDocument()
    })
  })

  test('should filter todos correctly', async () => {
    render(<TodoApp />)
    
    // Add multiple todos
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const addButton = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: 'Active todo' } })
    fireEvent.click(addButton)
    
    fireEvent.change(input, { target: { value: 'Todo to complete' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('Active todo')).toBeInTheDocument()
      expect(screen.getByText('Todo to complete')).toBeInTheDocument()
    })
    
    // Complete one todo
    const completeButtons = screen.getAllByRole('button', { name: '完了' })
    fireEvent.click(completeButtons[0])
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '未完了' })).toBeInTheDocument()
    })
    
    // Test active filter
    const activeFilter = screen.getByText(/未完了/)
    fireEvent.click(activeFilter)
    
    await waitFor(() => {
      expect(screen.getByText('Active todo')).toBeInTheDocument()
      expect(screen.queryByText('Todo to complete')).not.toBeInTheDocument()
    })
    
    // Test completed filter
    const completedFilter = screen.getByText(/完了済み/)
    fireEvent.click(completedFilter)
    
    await waitFor(() => {
      expect(screen.queryByText('Active todo')).not.toBeInTheDocument()
      expect(screen.getByText('Todo to complete')).toBeInTheDocument()
    })
  })

  test('should update filter counts correctly', async () => {
    render(<TodoApp />)
    
    // Initially should show (0) for all filters
    expect(screen.getByText('すべて (0)')).toBeInTheDocument()
    expect(screen.getByText('未完了 (0)')).toBeInTheDocument()
    expect(screen.getByText('完了済み (0)')).toBeInTheDocument()
    
    // Add todos
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const addButton = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: 'Todo 1' } })
    fireEvent.click(addButton)
    fireEvent.change(input, { target: { value: 'Todo 2' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      expect(screen.getByText('すべて (2)')).toBeInTheDocument()
      expect(screen.getByText('未完了 (2)')).toBeInTheDocument()
      expect(screen.getByText('完了済み (0)')).toBeInTheDocument()
    })
    
    // Complete one todo
    const completeButton = screen.getAllByRole('button', { name: '完了' })[0]
    fireEvent.click(completeButton)
    
    await waitFor(() => {
      expect(screen.getByText('すべて (2)')).toBeInTheDocument()
      expect(screen.getByText('未完了 (1)')).toBeInTheDocument()
      expect(screen.getByText('完了済み (1)')).toBeInTheDocument()
    })
  })

  test('should prevent adding empty todos', () => {
    render(<TodoApp />)
    
    const addButton = screen.getByRole('button', { name: '追加' })
    
    // Button should be disabled initially
    expect(addButton).toBeDisabled()
    
    // Try to add empty todo
    fireEvent.click(addButton)
    
    // Should still show empty state
    expect(screen.getByText('TODOがありません')).toBeInTheDocument()
  })

  test('should prevent adding todos with only whitespace', () => {
    render(<TodoApp />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const addButton = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(addButton)
    
    // Should still show empty state
    expect(screen.getByText('TODOがありません')).toBeInTheDocument()
    expect(input).toHaveValue('   ')
  })

  test('should handle Enter key for adding todos', async () => {
    render(<TodoApp />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    
    fireEvent.change(input, { target: { value: 'Todo via Enter' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    await waitFor(() => {
      expect(screen.getByText('Todo via Enter')).toBeInTheDocument()
    })
  })

  test('should apply retro styling theme', () => {
    const { container } = render(<TodoApp />)
    
    // Check for gradient background
    const mainWrapper = container.querySelector('div')
    expect(mainWrapper).toHaveClass('bg-gradient-to-br', 'from-retro-lightblue', 'to-retro-blue')
    
    // Check for retro font
    expect(mainWrapper).toHaveClass('font-retro')
  })

  test('should handle maximum todo content length', async () => {
    render(<TodoApp />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const addButton = screen.getByRole('button', { name: '追加' })
    
    const longContent = 'a'.repeat(501) // Over 500 character limit
    
    fireEvent.change(input, { target: { value: longContent } })
    fireEvent.click(addButton)
    
    // Should not add todo if over character limit
    expect(screen.getByText('TODOがありません')).toBeInTheDocument()
  })

  test('should maintain todos order (newest first)', async () => {
    render(<TodoApp />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const addButton = screen.getByRole('button', { name: '追加' })
    
    // Add todos in sequence
    fireEvent.change(input, { target: { value: 'First todo' } })
    fireEvent.click(addButton)
    
    fireEvent.change(input, { target: { value: 'Second todo' } })
    fireEvent.click(addButton)
    
    fireEvent.change(input, { target: { value: 'Third todo' } })
    fireEvent.click(addButton)
    
    await waitFor(() => {
      const todoItems = screen.getAllByTestId(/^todo-item-/)
      expect(todoItems).toHaveLength(3)
    })
    
    // Should display newest first
    const todoTexts = screen.getAllByText(/todo$/)
    expect(todoTexts[0]).toHaveTextContent('Third todo')
    expect(todoTexts[1]).toHaveTextContent('Second todo')
    expect(todoTexts[2]).toHaveTextContent('First todo')
  })
})