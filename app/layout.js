//import css file
import './globals.scss'
import './tokens.css'
import 'leaflet/dist/leaflet.css'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import Script from 'next/script';
import ClientProvider from '@/Providers/ClientProvider';
import { getPageUrl, siteName, siteUrl } from '@/site.config';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-prompt',
  weight: ['400', '500', '600', '700', '800'],
  preload: true
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-work-sans',
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: true
})

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: getPageUrl('/logo.png'),
  },
}

const hubspotPortalId = String(process.env.HUBSPOT_PORTAL_ID || '').replace(/\D/g, '');

export default function RootLayout({ children }) {
  return (
    <html lang="en-NZ" >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${inter.variable}`}>
        <ClientProvider>
          {children}
        </ClientProvider>
        {hubspotPortalId && (
          <Script
            id="hs-script-loader"
            src={`https://js.hs-scripts.com/${hubspotPortalId}.js`}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
