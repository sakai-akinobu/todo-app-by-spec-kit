import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TodoItem } from '@/components/TodoItem'
import { Todo } from '@/types/todo'

describe('TodoItem Component Tests', () => {
  const mockOnToggle = vi.fn()
  const mockOnDelete = vi.fn()

  const activeTodo: Todo = {
    id: '1',
    content: 'Active todo item',
    completed: false,
    createdAt: new Date('2025-09-03T10:00:00.000Z')
  }

  const completedTodo: Todo = {
    id: '2',
    content: 'Completed todo item',
    completed: true,
    createdAt: new Date('2025-09-03T11:00:00.000Z')
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render active todo correctly', () => {
    render(<TodoItem todo={activeTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('Active todo item')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '完了' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument()
  })

  test('should render completed todo correctly', () => {
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('Completed todo item')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '未完了' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument()
  })

  test('should call onToggle when toggle button is clicked for active todo', () => {
    render(<TodoItem todo={activeTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const toggleButton = screen.getByRole('button', { name: '完了' })
    fireEvent.click(toggleButton)
    
    expect(mockOnToggle).toHaveBeenCalledWith('1')
  })

  test('should call onToggle when toggle button is clicked for completed todo', () => {
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const toggleButton = screen.getByRole('button', { name: '未完了' })
    fireEvent.click(toggleButton)
    
    expect(mockOnToggle).toHaveBeenCalledWith('2')
  })

  test('should call onDelete when delete button is clicked', () => {
    render(<TodoItem todo={activeTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const deleteButton = screen.getByRole('button', { name: '削除' })
    fireEvent.click(deleteButton)
    
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  test('should apply correct styling for active todo', () => {
    render(<TodoItem todo={activeTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const todoText = screen.getByText('Active todo item')
    expect(todoText).not.toHaveClass('line-through', 'text-retro-darksilver')
    expect(todoText).toHaveClass('text-gray-900')
  })

  test('should apply correct styling for completed todo', () => {
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const todoText = screen.getByText('Completed todo item')
    expect(todoText).toHaveClass('line-through', 'text-retro-darksilver')
  })

  test('should render with correct data-testid', () => {
    render(<TodoItem todo={activeTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const todoItem = screen.getByTestId('todo-item-1')
    expect(todoItem).toBeInTheDocument()
  })

  test('should apply retro button styling for active todo', () => {
    render(<TodoItem todo={activeTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const completeButton = screen.getByRole('button', { name: '完了' })
    const deleteButton = screen.getByRole('button', { name: '削除' })
    
    expect(completeButton).toHaveClass('bg-retro-green', 'text-white')
    expect(deleteButton).toHaveClass('bg-retro-red', 'text-white')
  })

  test('should apply retro button styling for completed todo', () => {
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const incompleteButton = screen.getByRole('button', { name: '未完了' })
    const deleteButton = screen.getByRole('button', { name: '削除' })
    
    expect(incompleteButton).toHaveClass('bg-retro-accent', 'text-white')
    expect(deleteButton).toHaveClass('bg-retro-red', 'text-white')
  })

  test('should handle long todo content correctly', () => {
    const longTodo: Todo = {
      ...activeTodo,
      content: 'This is a very long todo item that should wrap properly and not break the layout of the application'
    }
    
    render(<TodoItem todo={longTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    expect(screen.getByText(/This is a very long todo item/)).toBeInTheDocument()
  })

  test('should handle special characters in todo content', () => {
    const specialTodo: Todo = {
      ...activeTodo,
      content: 'Todo with special chars: @#$%^&*()_+ 日本語 émojis 🎉'
    }
    
    render(<TodoItem todo={specialTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('Todo with special chars: @#$%^&*()_+ 日本語 émojis 🎉')).toBeInTheDocument()
  })

  test('should maintain layout structure', () => {
    const { container } = render(
      <TodoItem todo={activeTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
    )
    
    const item = container.querySelector('li')
    expect(item).toHaveClass('flex', 'items-center', 'justify-between')
    expect(item).toHaveClass('p-3', 'bg-white', 'border', 'border-retro-silver')
  })

  test('should prevent event bubbling on button clicks', () => {
    const mockItemClick = vi.fn()
    
    render(
      <div onClick={mockItemClick}>
        <TodoItem todo={activeTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      </div>
    )
    
    const toggleButton = screen.getByRole('button', { name: '完了' })
    fireEvent.click(toggleButton)
    
    expect(mockOnToggle).toHaveBeenCalled()
    expect(mockItemClick).not.toHaveBeenCalled()
  })

  test('should handle rapid clicking gracefully', () => {
    render(<TodoItem todo={activeTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />)
    
    const toggleButton = screen.getByRole('button', { name: '完了' })
    
    // Simulate rapid clicking
    fireEvent.click(toggleButton)
    fireEvent.click(toggleButton)
    fireEvent.click(toggleButton)
    
    expect(mockOnToggle).toHaveBeenCalledTimes(3)
    expect(mockOnToggle).toHaveBeenCalledWith('1')
  })
})