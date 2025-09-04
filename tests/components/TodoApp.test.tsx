import React from 'react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { TodoApp } from '@/components/TodoApp'

// Mock the storage service
const mockLoadTodos = vi.fn().mockResolvedValue([])
const mockSaveTodos = vi.fn().mockResolvedValue(undefined)
const mockClearAll = vi.fn().mockResolvedValue(undefined)
const mockIsAvailable = vi.fn().mockReturnValue(true)
const mockGetStorageInfo = vi.fn().mockResolvedValue({ version: '1.0.0', lastUpdated: new Date() })

vi.mock('@/services/todoStorage', () => ({
  TodoStorage: vi.fn().mockImplementation(() => ({
    loadTodos: mockLoadTodos,
    saveTodos: mockSaveTodos,
    clearAll: mockClearAll,
    isAvailable: mockIsAvailable,
    getStorageInfo: mockGetStorageInfo
  }))
}))

describe('TodoApp Component Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLoadTodos.mockResolvedValue([])
    mockSaveTodos.mockResolvedValue(undefined)
    mockIsAvailable.mockReturnValue(true)
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
    await act(async () => {
      render(<TodoApp />)
    })
    
    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.getByText('TODOがありません')).toBeInTheDocument()
    })
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'New test todo' } })
    })
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '追加' })).not.toBeDisabled()
    })
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '追加' }))
    })
    
    await waitFor(() => {
      expect(screen.getByText('New test todo')).toBeInTheDocument()
    })
    
    // Input should be cleared
    expect(input).toHaveValue('')
  })

  test('should toggle todo completion status', async () => {
    await act(async () => {
      render(<TodoApp />)
    })
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('TODOがありません')).toBeInTheDocument()
    })
    
    // Add a todo first
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Test todo' } })
    })
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '追加' }))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Test todo')).toBeInTheDocument()
    })
    
    // Toggle to completed
    await act(async () => {
      const completeButton = screen.getByRole('button', { name: '完了' })
      fireEvent.click(completeButton)
    })
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '未完了' })).toBeInTheDocument()
    })
    
    // Toggle back to active
    await act(async () => {
      const incompleteButton = screen.getByRole('button', { name: '未完了' })
      fireEvent.click(incompleteButton)
    })
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '完了' })).toBeInTheDocument()
    })
  })

  test('should delete todo when delete button is clicked', async () => {
    await act(async () => {
      render(<TodoApp />)
    })
    
    await waitFor(() => {
      expect(screen.getByText('TODOがありません')).toBeInTheDocument()
    })
    
    // Add a todo first
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Todo to delete' } })
    })
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '追加' }))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Todo to delete')).toBeInTheDocument()
    })
    
    // Delete the todo
    await act(async () => {
      const deleteButton = screen.getByRole('button', { name: '削除' })
      fireEvent.click(deleteButton)
    })
    
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
    await act(async () => {
      render(<TodoApp />)
    })
    
    await waitFor(() => {
      expect(screen.getByText('TODOがありません')).toBeInTheDocument()
    })
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    
    // Add todos in sequence
    await act(async () => {
      fireEvent.change(input, { target: { value: 'First todo' } })
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '追加' }))
    })
    
    await waitFor(() => {
      expect(screen.getByText('First todo')).toBeInTheDocument()
    })
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Second todo' } })
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '追加' }))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Second todo')).toBeInTheDocument()
    })
    
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Third todo' } })
    })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '追加' }))
    })
    
    await waitFor(() => {
      expect(screen.getByText('Third todo')).toBeInTheDocument()
    })
    
    await waitFor(() => {
      const todoItems = screen.getAllByTestId(/^todo-item-/)
      expect(todoItems).toHaveLength(3)
    })
    
    // Should display newest first - check by getting all todo content spans
    const todoContents = screen.getAllByText(/todo$/)
    expect(todoContents[0]).toHaveTextContent('Third todo')
    expect(todoContents[1]).toHaveTextContent('Second todo')
    expect(todoContents[2]).toHaveTextContent('First todo')
  })
})