import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Personal TODO Manager',
  description: 'A retro-style personal todo management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}