import './globals.css'

export const metadata = {
  title: 'Workerslife Group — Contract Register & Notification App',
  description: 'Related-party & outsourcing register · Joint Standard 1 of 2024 / Insurance Act s. 32 governance support',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
