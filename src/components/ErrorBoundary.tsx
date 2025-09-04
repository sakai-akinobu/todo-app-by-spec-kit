'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * エラーバウンダリコンポーネント
 * 子コンポーネントでエラーが発生した場合のフォールバックUIを表示
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-retro-lightblue to-retro-blue font-retro flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-lg max-w-md mx-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">⚠️ エラーが発生しました</h1>
              <p className="text-retro-lightblue mb-6">
                申し訳ございません。予期しないエラーが発生しました。
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-retro-blue text-white rounded-md 
                           hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-retro-blue 
                           font-bold transition-colors duration-200"
                >
                  ページを再読み込み
                </button>
                <details className="text-left">
                  <summary className="cursor-pointer text-white/70 text-sm hover:text-white">
                    エラー詳細を表示
                  </summary>
                  <pre className="mt-2 text-xs text-white/60 bg-black/20 p-2 rounded overflow-auto">
                    {this.state.error?.message}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}