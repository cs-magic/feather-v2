import "@/styles/globals.css"
import React, { PropsWithChildren } from "react"
import { Metadata } from "next"
import { ToastContainer, Zoom } from "react-toastify"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

import "react-toastify/dist/ReactToastify.css"
import Head from "next/head"
import { SocketEvent } from "@/ds/socket"

import { useSocketEvents } from "@/hooks/socket"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
        </Head>

        <body
          className={cn(
            "h-screen overflow-hidden bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {/* main 里用了 --app-height 所以是必须的 */}
            <main>{children}</main>

            <TailwindIndicator />
            {/*<Toaster richColors closeButton position="top-right" />*/}
            <ToastContainer hideProgressBar transition={Zoom} />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
