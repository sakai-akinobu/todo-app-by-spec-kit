import { TodoApp } from '@/components/TodoApp'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function Home() {
  return (
    <ErrorBoundary>
      <TodoApp />
    </ErrorBoundary>
  )
}