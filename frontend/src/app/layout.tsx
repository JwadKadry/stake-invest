import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RealEstate - Invest in Real Estate Properties',
  description: 'Fractional ownership of premium properties. Start investing with as little as $1,000 and build your real estate portfolio.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

