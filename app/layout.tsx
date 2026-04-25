import './globals.css'
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import Ticker from '@/components/Ticker'
import AuthProvider from '@/components/AuthProvider'

export const metadata = {
  title: 'Risk24 | Risk Management Dashboard',
  description: 'Dynamic Risk Management and Travel Safety Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="h-screen antialiased bg-white text-slate-900 font-sans">
        <AuthProvider>
          <div className="flex h-full overflow-hidden">
            
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden relative">
              <Ticker />
              <TopNav />

              <main className="flex-1 overflow-y-auto w-full p-6">
                {children}
              </main>
            </div>

          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
