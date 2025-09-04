import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoList } from '@/components/TodoList'
import { Todo } from '@/types/todo'

describe('TodoList Component Tests', () => {
  const mockOnToggle = vi.fn()
  const mockOnDelete = vi.fn()

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
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render all todos when provided', () => {
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('Active todo 1')).toBeInTheDocument()
    expect(screen.getByText('Completed todo 1')).toBeInTheDocument()
    expect(screen.getByText('Active todo 2')).toBeInTheDocument()
  })

  test('should render empty state when no todos', () => {
    render(<TodoList todos={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('TODOがありません')).toBeInTheDocument()
    expect(screen.getByText('新しいTODOを追加してください。')).toBeInTheDocument()
  })

  test('should render empty state with retro styling', () => {
    render(<TodoList todos={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const emptyMessage = screen.getByText('TODOがありません')
    expect(emptyMessage).toHaveClass('text-retro-darksilver')
  })

  test('should render todos in correct order', () => {
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const todoItems = screen.getAllByTestId(/^todo-item-/)
    expect(todoItems).toHaveLength(3)
    
    // Should maintain the order of todos as passed
    expect(todoItems[0]).toHaveAttribute('data-testid', 'todo-item-1')
    expect(todoItems[1]).toHaveAttribute('data-testid', 'todo-item-2')
    expect(todoItems[2]).toHaveAttribute('data-testid', 'todo-item-3')
  })

  test('should pass correct props to TodoItem components', () => {
    render(<TodoList todos={[mockTodos[0]]} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    // TodoItem should receive the todo data
    expect(screen.getByText('Active todo 1')).toBeInTheDocument()
    
    // TodoItem should have toggle and delete buttons
    expect(screen.getByRole('button', { name: '完了' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument()
  })

  test('should handle completed todos correctly', () => {
    render(<TodoList todos={[mockTodos[1]]} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    // Completed todo should show "未完了" button instead of "完了"
    expect(screen.getByRole('button', { name: '未完了' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument()
  })

  test('should apply retro list styling', () => {
    const { container } = render(
      <TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />
    )
    
    const list = container.querySelector('ul')
    expect(list).toHaveClass('space-y-2')
  })

  test('should handle single todo correctly', () => {
    const singleTodo = [mockTodos[0]]
    render(<TodoList todos={singleTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('Active todo 1')).toBeInTheDocument()
    expect(screen.getAllByTestId(/^todo-item-/)).toHaveLength(1)
  })

  test('should handle mixed completed/active todos', () => {
    const mixedTodos = [mockTodos[0], mockTodos[1]] // One active, one completed
    render(<TodoList todos={mixedTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    // Should show both complete and incomplete buttons
    expect(screen.getByRole('button', { name: '完了' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '未完了' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '削除' })).toHaveLength(2)
  })

  test('should preserve todo IDs in rendered items', () => {
    render(<TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    // Each TodoItem should have the correct data-testid based on todo ID
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument()
    expect(screen.getByTestId('todo-item-3')).toBeInTheDocument()
  })

  test('should render with retro container styling', () => {
    const { container } = render(
      <TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />
    )
    
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('bg-white', 'border', 'border-retro-silver')
  })
})