import AuthSessionProvider from '@/components/providers/AuthSessionProvider';
import { poppins } from '@/styles/fonts';
import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Lotofacil Business Intelligence',
  description: 'Sistema de Lotofacil business intelligence WEB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={`${poppins.className} bg-background dark:bg-backgroundDark `}>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}
