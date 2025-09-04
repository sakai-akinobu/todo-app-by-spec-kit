'use client'

import { useState, useEffect } from 'react'
import { Todo, FilterStatus, createTodo } from '@/types/todo'
import { TodoStorage } from '@/services/todoStorage'
import { filterTodos, getTodoCounts } from '@/services/todoFilter'
import { TodoInput } from './TodoInput'
import { TodoList } from './TodoList'
import { TodoFilters } from './TodoFilters'

/**
 * TODOアプリのメインコンポーネント
 * 状態管理とコンポーネント統合を担当
 */
export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('all')
  const [storage] = useState(() => new TodoStorage())

  // 初期データロード
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await storage.loadTodos()
        setTodos(loadedTodos)
      } catch (error) {
        console.error('Failed to load todos:', error)
      }
    }

    loadTodos()
  }, [storage])

  // TODOが変更されたときの自動保存
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await storage.saveTodos(todos)
      } catch (error) {
        console.error('Failed to save todos:', error)
      }
    }

    if (todos.length > 0) {
      saveTodos()
    }
  }, [todos, storage])

  const handleAddTodo = (content: string) => {
    try {
      const newTodo = createTodo(content)
      setTodos(prevTodos => [newTodo, ...prevTodos]) // 新しいものを先頭に追加
    } catch (error) {
      console.error('Failed to create todo:', error)
    }
  }

  const handleToggleTodo = (id: string) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
  }

  const handleDeleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
  }

  const handleFilterChange = (filter: FilterStatus) => {
    setCurrentFilter(filter)
  }

  // フィルタリングされたTODOを取得
  const filteredTodos = filterTodos(todos, currentFilter)
  const counts = getTodoCounts(todos)

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-lightblue to-retro-blue font-retro">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            📝 レトロTODOアプリ
          </h1>
          <p className="text-retro-lightblue text-lg">
            シンプルで使いやすいTODO管理ツール
          </p>
        </header>

        {/* メインコンテンツ */}
        <main className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          {/* TODO入力 */}
          <TodoInput onAdd={handleAddTodo} />
          
          {/* フィルタボタン */}
          <TodoFilters
            currentFilter={currentFilter}
            counts={counts}
            onFilterChange={handleFilterChange}
          />
          
          {/* TODOリスト */}
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        </main>

        {/* フッター */}
        <footer className="text-center mt-8">
          <p className="text-white/70 text-sm">
            Built with Next.js & TypeScript ✨
          </p>
        </footer>
      </div>
    </div>
  )
}