'use client'

import { useState, KeyboardEvent } from 'react'

interface TodoInputProps {
  onAdd: (content: string) => void
}

/**
 * TODOアイテム入力コンポーネント
 * 新しいTODOを追加するための入力フィールドとボタンを提供
 */
export function TodoInput({ onAdd }: TodoInputProps) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmedInput = input.trim()
    
    // 空の入力や500文字超過をチェック
    if (trimmedInput.length === 0 || trimmedInput.length > 500) {
      return
    }
    
    onAdd(trimmedInput)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  const isDisabled = input.trim().length === 0 || input.trim().length > 500

  return (
    <div className="flex gap-2 mb-6">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="新しいTODOを入力..."
        className="flex-1 px-3 py-2 border border-retro-blue rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-retro-blue focus:border-transparent
                   bg-white text-gray-900 placeholder-gray-500"
        maxLength={501} // Allow typing over limit for validation
      />
      <button
        onClick={handleAdd}
        disabled={isDisabled}
        className="px-4 py-2 bg-retro-blue text-white rounded-md 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-retro-blue 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   font-bold transition-colors duration-200"
      >
        追加
      </button>
    </div>
  )
}