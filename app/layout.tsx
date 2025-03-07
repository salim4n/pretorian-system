import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/app/lib/utils"
import { ThemeProvider } from "../components/theme-provider"
import Header from "@/components/layout/header"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/layout/footer"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Pretorian - Security Solutions",
  description: "Pretorian System is a security solutions company that provides Computer Vision to businesses and individuals.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="FR-fr">
           <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              <Header />
              <main>
                  {children}
                  <Toaster />
              </main>
              <Footer />
            </ThemeProvider>
        </body>
    </html>
  );
}
