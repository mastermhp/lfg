import { Inter } from 'next/font/google'
import "./globals.css";
import "./custom-styles.css";
import { ClerkProvider } from "@clerk/nextjs";
import { NavBar } from './components/NavBar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LGF V4',
  description: 'Enhanced LFG interface with neon background',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <NavBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
