import './globals.css';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import Ticker from '@/components/Ticker';

export const metadata = {
  title: 'Risk24 | Risk Management Dashboard',
  description: 'Dynamic Risk Management and Travel Safety Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden antialiased bg-white text-slate-900 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <Ticker />
          <TopNav />
          <main className="flex-1 overflow-y-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
