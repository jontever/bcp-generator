import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BCP Generator — Business Continuity Plan for UK SMBs',
  description:
    'Create a professional, AI-powered Business Continuity Plan tailored to your UK small or medium business. Free and open source.',
  keywords: ['business continuity plan', 'BCP', 'SMB', 'UK', 'resilience', 'disaster recovery'],
  openGraph: {
    title: 'BCP Generator',
    description: 'AI-powered Business Continuity Plans for UK SMBs',
    url: 'https://bcp.govassure.uk',
    siteName: 'BCP Generator',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <header className="border-b-4 border-gov-yellow bg-gov-blue text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              <a href="/" className="flex items-center gap-3 font-bold tracking-tight">
                <span className="text-lg">BCP Generator</span>
                <span className="hidden text-xs font-normal text-blue-200 sm:block">
                  Business Continuity Planning for UK SMBs
                </span>
              </a>
              <nav className="flex items-center gap-4 text-sm text-blue-200">
                <a href="https://www.ncsc.gov.uk/section/information-for/small-medium-sized-organisations" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">NCSC Guidance</a>
                <a href="https://www.gov.uk/guidance/business-continuity-management-toolkit" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Gov.uk Toolkit</a>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-56px-64px)]">
          {children}
        </main>
        <footer className="border-t border-gray-200 bg-white py-8 mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-2 text-center text-sm text-gray-500">
              <p>Open source — <a href="https://github.com/jontever/bcp-generator" className="underline hover:text-gray-900 transition-colors">github.com/jontever/bcp-generator</a></p>
              <p>This tool helps you draft a BCP. Always review the output with a qualified professional for your sector.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
