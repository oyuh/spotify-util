'use client'

import { ReactNode } from 'react'
import { DisplayStyleProvider } from '@/contexts/display-style-context'

export default function StreamLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <DisplayStyleProvider>
      <div className="bg-transparent min-h-screen overflow-hidden w-full h-full fixed inset-0" style={{
        background: 'transparent',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            background: transparent !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          html {
            background: transparent !important;
          }
          main {
            padding-top: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          nav {
            display: none !important;
          }
          header {
            display: none !important;
          }
          .pt-16 {
            padding-top: 0 !important;
          }
        `
      }} />
      {children}
    </div>
    </DisplayStyleProvider>
  )
}
