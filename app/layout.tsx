import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter, Space_Grotesk as SpaceGroktest } from 'next/font/google';
import type {Metadata} from 'next'
import React from 'react'
import { ThemeProvider } from '@/context/ThemeProvider';
import '../styles/prism.css'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ['latin'],
  weight:['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const spaceGrotesk = SpaceGroktest({
  subsets: ['latin'],
  weight:['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'DevOverFlow-HCMUTE',
  description: 'A place for developers to ask questions and find answers',
  icons: {
    icon:'/assets/images/site-logo.svg',
  }
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body className={`${inter.className} ${spaceGrotesk.className}`}>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: 'primary-gradient',
              footerActionLink: 'primary-text-gradient hover:text-primary-500',
            }
          }}
          >
          <ThemeProvider>
            <Analytics/>
            {children}
          </ThemeProvider> 
          </ClerkProvider> 
        </body>
      </html>
  )
}