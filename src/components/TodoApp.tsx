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
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 初期データロード
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await storage.loadTodos()
        setTodos(loadedTodos)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to load todos:', error)
        setIsInitialized(true)
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

    // 初期化完了後のみ保存実行
    if (isInitialized) {
      saveTodos()
    }
  }, [todos, storage, isInitialized])

  const handleAddTodo = (content: string) => {
    try {
      const newTodo = createTodo(content)
      setTodos(prevTodos => [newTodo, ...prevTodos]) // 新しいものを先頭に追加
      setError(null) // 成功時はエラーをクリア
    } catch (error) {
      console.error('Failed to create todo:', error)
      setError('TODOの追加に失敗しました。再度お試しください。')
    }
  }

  const handleToggleTodo = (id: string) => {
    try {
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id 
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      )
      setError(null)
    } catch (error) {
      console.error('Failed to toggle todo:', error)
      setError('TODO状態の変更に失敗しました。')
    }
  }

  const handleDeleteTodo = (id: string) => {
    try {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
      setError(null)
    } catch (error) {
      console.error('Failed to delete todo:', error)
      setError('TODOの削除に失敗しました。')
    }
  }

  const handleFilterChange = (filter: FilterStatus) => {
    setCurrentFilter(filter)
  }

  // フィルタリングされたTODOを取得
  const filteredTodos = filterTodos(todos, currentFilter)
  const counts = getTodoCounts(todos)

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-lightblue to-retro-blue font-retro">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-4xl">
        {/* ヘッダー */}
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            📝 レトロTODOアプリ
          </h1>
          <p className="text-retro-lightblue text-sm sm:text-base lg:text-lg">
            シンプルで使いやすいTODO管理ツール
          </p>
        </header>

        {/* メインコンテンツ */}
        <main className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-lg">
          {/* エラー表示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/80 text-white rounded-md backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                  aria-label="エラーを閉じる"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          
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
        <footer className="text-center mt-6 sm:mt-8">
          <p className="text-white/70 text-xs sm:text-sm">
            Built with Next.js & TypeScript ✨
          </p>
        </footer>
      </div>
    </div>
  )
}