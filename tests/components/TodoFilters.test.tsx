import React from 'react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TodoFilters } from '@/components/TodoFilters'
import { FilterStatus } from '@/types/todo'

describe('TodoFilters Component Tests', () => {
  const mockOnFilterChange = vi.fn()

  const mockCounts = {
    all: 10,
    active: 5,
    completed: 5
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render all filter buttons', () => {
    render(
      <TodoFilters 
        currentFilter="all" 
        counts={mockCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    expect(screen.getByText('すべて (10)')).toBeInTheDocument()
    expect(screen.getByText('未完了 (5)')).toBeInTheDocument()
    expect(screen.getByText('完了済み (5)')).toBeInTheDocument()
  })

  test('should highlight current filter', () => {
    render(
      <TodoFilters 
        currentFilter="active" 
        counts={mockCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    const activeButton = screen.getByText('未完了 (5)')
    const allButton = screen.getByText('すべて (10)')
    const completedButton = screen.getByText('完了済み (5)')
    
    expect(activeButton).toHaveClass('bg-retro-blue', 'text-white')
    expect(allButton).not.toHaveClass('bg-retro-blue', 'text-white')
    expect(completedButton).not.toHaveClass('bg-retro-blue', 'text-white')
  })

  test('should call onFilterChange when all filter is clicked', () => {
    render(
      <TodoFilters 
        currentFilter="active" 
        counts={mockCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    const allButton = screen.getByText('すべて (10)')
    fireEvent.click(allButton)
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('all')
  })

  test('should call onFilterChange when active filter is clicked', () => {
    render(
      <TodoFilters 
        currentFilter="all" 
        counts={mockCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    const activeButton = screen.getByText('未完了 (5)')
    fireEvent.click(activeButton)
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('active')
  })

  test('should call onFilterChange when completed filter is clicked', () => {
    render(
      <TodoFilters 
        currentFilter="all" 
        counts={mockCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    const completedButton = screen.getByText('完了済み (5)')
    fireEvent.click(completedButton)
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('completed')
  })

  test('should not call onFilterChange when current filter is clicked', () => {
    render(
      <TodoFilters 
        currentFilter="all" 
        counts={mockCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    const allButton = screen.getByText('すべて (10)')
    fireEvent.click(allButton)
    
    // Should not call when clicking the already active filter
    expect(mockOnFilterChange).not.toHaveBeenCalled()
  })

  test('should display correct counts for each filter', () => {
    const customCounts = {
      all: 7,
      active: 3,
      completed: 4
    }
    
    render(
      <TodoFilters 
        currentFilter="all" 
        counts={customCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    expect(screen.getByText('すべて (7)')).toBeInTheDocument()
    expect(screen.getByText('未完了 (3)')).toBeInTheDocument()
    expect(screen.getByText('完了済み (4)')).toBeInTheDocument()
  })

  test('should handle zero counts correctly', () => {
    const zeroCounts = {
      all: 0,
      active: 0,
      completed: 0
    }
    
    render(
      <TodoFilters 
        currentFilter="all" 
        counts={zeroCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    expect(screen.getByText('すべて (0)')).toBeInTheDocument()
    expect(screen.getByText('未完了 (0)')).toBeInTheDocument()
    expect(screen.getByText('完了済み (0)')).toBeInTheDocument()
  })

  test('should handle single count correctly', () => {
    const singleCounts = {
      all: 1,
      active: 1,
      completed: 0
    }
    
    render(
      <TodoFilters 
        currentFilter="all" 
        counts={singleCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    expect(screen.getByText('すべて (1)')).toBeInTheDocument()
    expect(screen.getByText('未完了 (1)')).toBeInTheDocument()
    expect(screen.getByText('完了済み (0)')).toBeInTheDocument()
  })

  test('should apply retro styling to filter buttons', () => {
    render(
      <TodoFilters 
        currentFilter="all" 
        counts={mockCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    const allButton = screen.getByText('すべて (10)')
    const activeButton = screen.getByText('未完了 (5)')
    const completedButton = screen.getByText('完了済み (5)')
    
    // Active filter should have blue background
    expect(allButton).toHaveClass('bg-retro-blue', 'text-white')
    
    // Inactive filters should have silver background
    expect(activeButton).toHaveClass('bg-retro-silver', 'text-gray-800')
    expect(completedButton).toHaveClass('bg-retro-silver', 'text-gray-800')
  })

  test('should apply retro container styling', () => {
    const { container } = render(
      <TodoFilters 
        currentFilter="all" 
        counts={mockCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('flex', 'justify-center', 'gap-2')
  })

  test('should handle filter changes for completed filter', () => {
    render(
      <TodoFilters 
        currentFilter="completed" 
        counts={mockCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    const completedButton = screen.getByText('完了済み (5)')
    const allButton = screen.getByText('すべて (10)')
    const activeButton = screen.getByText('未完了 (5)')
    
    // Completed should be active
    expect(completedButton).toHaveClass('bg-retro-blue', 'text-white')
    expect(allButton).toHaveClass('bg-retro-silver', 'text-gray-800')
    expect(activeButton).toHaveClass('bg-retro-silver', 'text-gray-800')
  })

  test('should maintain button accessibility', () => {
    render(
      <TodoFilters 
        currentFilter="all" 
        counts={mockCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    const allButton = screen.getByRole('button', { name: 'すべて (10)' })
    const activeButton = screen.getByRole('button', { name: '未完了 (5)' })
    const completedButton = screen.getByRole('button', { name: '完了済み (5)' })
    
    expect(allButton).toBeInTheDocument()
    expect(activeButton).toBeInTheDocument()
    expect(completedButton).toBeInTheDocument()
  })

  test('should handle rapid filter changes', () => {
    render(
      <TodoFilters 
        currentFilter="all" 
        counts={mockCounts} 
        onFilterChange={mockOnFilterChange} 
      />
    )
    
    const activeButton = screen.getByText('未完了 (5)')
    const completedButton = screen.getByText('完了済み (5)')
    
    // Simulate rapid clicking
    fireEvent.click(activeButton)
    fireEvent.click(completedButton)
    fireEvent.click(activeButton)
    
    expect(mockOnFilterChange).toHaveBeenCalledTimes(3)
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(1, 'active')
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(2, 'completed')
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(3, 'active')
  })
})