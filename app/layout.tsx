import "@/app/global.css"
import { Lexend, Geist_Mono } from "next/font/google"
import type { ReactNode } from "react"
import { Provider } from "./provider"

const lexend = Lexend({
  variable: "--font-sans",
  subsets: ["latin"],
})

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
