//import css file
import './globals.scss'
import './tokens.css'
import 'leaflet/dist/leaflet.css'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import Script from 'next/script';
import ClientProvider from '@/Providers/ClientProvider';
import { getPageUrl, siteName, siteUrl } from '@/site.config';
import StructuredData from '@/Components/SEO/StructuredData';
import { getBusinessContact } from '@/utils/seo';

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

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: `Windscreen Repair & Replacement Tauranga | ${siteName}`,
  description:
    'Mobile windscreen replacement, chip repair, ADAS recalibration and headlight restoration from a local Tauranga autoglass team.',
  openGraph: {
    siteName,
    locale: 'en_NZ',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  formatDetection: { email: false, address: false, telephone: false },
};

const contact = getBusinessContact();
const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  '@id': `${siteUrl}/#business`,
  name: siteName,
  url: siteUrl,
  ...(contact.phone ? { telephone: contact.phone } : {}),
  ...(contact.email ? { email: contact.email } : {}),
  ...(contact.address ? { address: contact.address } : {}),
  areaServed: [
    { '@type': 'City', name: 'Tauranga' },
    { '@type': 'AdministrativeArea', name: 'Western Bay of Plenty' },
  ],
  logo: {
    '@type': 'ImageObject',
    url: getPageUrl('/logo.png'),
  },
  image: getPageUrl('/logo.png'),
}

const hubspotPortalId = String(process.env.HUBSPOT_PORTAL_ID || '').replace(/\D/g, '');

export default function RootLayout({ children }) {
  return (
    <html lang="en-NZ" >
      <head>
        <StructuredData data={businessSchema} />
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
