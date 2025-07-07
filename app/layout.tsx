import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "fang.com.au | Australia's Largest Chinese Real Estate Platform",
  description: "Reach Chinese buyers directly with Fang.com.au. List your property, access Australia's largest Chinese real estate audience, and maximize your exposure across WeChat, Xiaohongshu, SydneyToday, and more.",
  openGraph: {
    title: "fang.com.au | Australia's Largest Chinese Real Estate Platform",
    description: "Reach Chinese buyers directly with Fang.com.au. List your property, access Australia's largest Chinese real estate audience, and maximize your exposure across WeChat, Xiaohongshu, SydneyToday, and more.",
    url: "https://fang.com.au",
    siteName: "Fang.com.au",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Fang.com.au",
      }
    ],
    locale: "en_AU",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Fang.com.au | Chinese Real Estate Marketing & Buyer Network",
    description: "Reach Chinese buyers directly with Fang.com.au. List your property, access Australia's largest Chinese real estate audience, and maximize your exposure across WeChat, Xiaohongshu, SydneyToday, and more.",
    images: ["/hero.png"],
    site: "@fangcomau"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
