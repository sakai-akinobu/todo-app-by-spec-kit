'use client'

import { Todo } from '@/types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * 個別のTODOアイテム表示コンポーネント
 * 完了/未完了の切り替えと削除機能を提供
 */
export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle(todo.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(todo.id)
  }

  return (
    <li 
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-white border border-retro-silver rounded-md
                 hover:shadow-md transition-shadow duration-200 gap-2 sm:gap-0"
      data-testid={`todo-item-${todo.id}`}
    >
      <span 
        className={`flex-1 mr-0 sm:mr-3 text-sm sm:text-base break-words ${
          todo.completed 
            ? 'line-through text-retro-darksilver' 
            : 'text-gray-900'
        }`}
      >
        {todo.content}
      </span>
      
      <div className="flex gap-1 sm:gap-2 self-end sm:self-center">
        <button
          onClick={handleToggle}
          className={`px-2 sm:px-3 py-1 text-white text-xs sm:text-sm font-bold rounded 
                     hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-50
                     transition-opacity duration-200 min-w-[50px] sm:min-w-[60px] ${
            todo.completed
              ? 'bg-retro-accent hover:bg-orange-700 focus:ring-retro-accent'
              : 'bg-retro-green hover:bg-green-700 focus:ring-retro-green'
          }`}
        >
          {todo.completed ? '未完了' : '完了'}
        </button>
        
        <button
          onClick={handleDelete}
          className="px-2 sm:px-3 py-1 bg-retro-red text-white text-xs sm:text-sm font-bold rounded
                     hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-retro-red focus:ring-opacity-50
                     transition-opacity duration-200 hover:opacity-80 min-w-[40px] sm:min-w-[50px]"
        >
          削除
        </button>
      </div>
    </li>
  )
}