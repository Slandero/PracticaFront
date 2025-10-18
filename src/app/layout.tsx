import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import ErrorBoundaryClient from '@/components/ErrorBoundaryClient'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Telecom Plus S.A.S.',
  description: 'Sistema de Gestión de Contratos de Telecomunicaciones',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ErrorBoundaryClient>
          <AuthProvider>
            <Navigation />
            {children}
          </AuthProvider>
        </ErrorBoundaryClient>
      </body>
    </html>
  )
}
