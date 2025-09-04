'use client'

import { Todo } from '@/types/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

/**
 * TODOリスト表示コンポーネント
 * フィルタリングされたTODOアイテムのリストを表示
 */
export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-retro-silver rounded-md">
        <p className="text-retro-darksilver text-lg mb-2">TODOがありません</p>
        <p className="text-retro-darksilver text-sm">新しいTODOを追加してください。</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-retro-silver rounded-md overflow-hidden">
      <ul className="space-y-2 p-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  )
}