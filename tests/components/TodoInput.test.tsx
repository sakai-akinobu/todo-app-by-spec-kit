import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TodoInput } from '@/components/TodoInput'

describe('TodoInput Component Tests', () => {
  const mockOnAdd = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render input field with placeholder', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  test('should render add button', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const button = screen.getByRole('button', { name: '追加' })
    expect(button).toBeInTheDocument()
  })

  test('should update input value when typing', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    fireEvent.change(input, { target: { value: 'Test todo' } })
    
    expect(input).toHaveValue('Test todo')
  })

  test('should call onAdd with input value when add button is clicked', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const button = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: 'Test todo' } })
    fireEvent.click(button)
    
    expect(mockOnAdd).toHaveBeenCalledWith('Test todo')
  })

  test('should call onAdd when Enter key is pressed', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    
    fireEvent.change(input, { target: { value: 'Test todo' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    
    expect(mockOnAdd).toHaveBeenCalledWith('Test todo')
  })

  test('should clear input after adding todo', async () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const button = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: 'Test todo' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  test('should not call onAdd with empty input', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const button = screen.getByRole('button', { name: '追加' })
    fireEvent.click(button)
    
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  test('should not call onAdd with whitespace-only input', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const button = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(button)
    
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  test('should trim whitespace from input before calling onAdd', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const button = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: '  Test todo  ' } })
    fireEvent.click(button)
    
    expect(mockOnAdd).toHaveBeenCalledWith('Test todo')
  })

  test('should handle very long input (500+ characters)', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const button = screen.getByRole('button', { name: '追加' })
    const longText = 'a'.repeat(501) // 501 characters
    
    fireEvent.change(input, { target: { value: longText } })
    fireEvent.click(button)
    
    // Should not call onAdd for text longer than 500 characters
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  test('should disable add button when input is empty', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const button = screen.getByRole('button', { name: '追加' })
    expect(button).toBeDisabled()
  })

  test('should enable add button when input has valid content', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const button = screen.getByRole('button', { name: '追加' })
    
    fireEvent.change(input, { target: { value: 'Test todo' } })
    
    expect(button).not.toBeDisabled()
  })

  test('should apply retro styling classes', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText('新しいTODOを入力...')
    const button = screen.getByRole('button', { name: '追加' })
    
    // Check for retro-themed styling classes
    expect(input).toHaveClass('border-retro-blue')
    expect(button).toHaveClass('bg-retro-blue', 'text-white')
  })
})