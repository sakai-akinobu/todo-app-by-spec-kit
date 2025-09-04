'use client'

import { FilterStatus } from '@/types/todo'

interface TodoFiltersProps {
  currentFilter: FilterStatus
  counts: {
    all: number
    active: number
    completed: number
  }
  onFilterChange: (filter: FilterStatus) => void
}

/**
 * TODOフィルタリングコンポーネント
 * すべて/未完了/完了済みでTODOをフィルタリング
 */
export function TodoFilters({ currentFilter, counts, onFilterChange }: TodoFiltersProps) {
  const handleFilterClick = (filter: FilterStatus) => {
    if (filter !== currentFilter) {
      onFilterChange(filter)
    }
  }

  const getButtonStyles = (filter: FilterStatus) => {
    const isActive = filter === currentFilter
    const baseStyles = "font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-retro-blue focus:ring-opacity-50"
    
    if (isActive) {
      return `${baseStyles} bg-retro-blue text-white`
    } else {
      return `${baseStyles} bg-retro-silver text-gray-800 hover:bg-gray-300`
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-4 sm:mb-6">
      <button
        onClick={() => handleFilterClick('all')}
        className={`${getButtonStyles('all')} text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2`}
      >
        すべて ({counts.all})
      </button>
      
      <button
        onClick={() => handleFilterClick('active')}
        className={`${getButtonStyles('active')} text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2`}
      >
        未完了 ({counts.active})
      </button>
      
      <button
        onClick={() => handleFilterClick('completed')}
        className={`${getButtonStyles('completed')} text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2`}
      >
        完了済み ({counts.completed})
      </button>
    </div>
  )
}