const { siteName, siteUrl } = require('./site.config');

// bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfigp} */
const nextConfig = {


    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true
    },
    images: {


        remotePatterns: [{
            protocol: 'http',
            hostname: 'as-autoglass.local',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'gurpreetd16.sg-host.com',
            port: '',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/**'
        }

    ],
    },
    env: {
        url: "http://as-autoglass.local",
        siteUrl: siteUrl,
        siteName: siteName,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
        ]
    },
    // async redirects() {
    //     return [
    //         { source: '/contact', destination: '/contact-us', permanent: true },
    //         { source: '/gallery', destination: '/our-work/gallery', permanent: true },
    //         { source: '/cleaning', destination: '/services/commercial-cleaning', permanent: true },
    //         { source: '/gardening', destination: '/services/maintenance-services', permanent: true },
    //         { source: '/matting', destination: '/services/maintenance-services', permanent: true },
    //         { source: '/signage', destination: '/services/maintenance-services', permanent: true },
    //         { source: '/property-management', destination: '/services/maintenance-services', permanent: true },
    //         { source: '/equipment-hire', destination: '/', permanent: true },
    //         { source: '/cable-protectors', destination: '/', permanent: true },
    //         { source: '/retractable-belts', destination: '/', permanent: true },
    //         { source: '/workplace-safety', destination: '/', permanent: true },
    //         { source: '/barrier-systems', destination: '/', permanent: true },
    //         { source: '/storage-systems', destination: '/', permanent: true },
    //         { source: '/spill-kits', destination: '/', permanent: true },
    //         { source: '/first-aid-kits', destination: '/', permanent: true },
    //         { source: '/carpark-safety-equipment', destination: '/', permanent: true },
    //         { source: '/covid-19-disinfection', destination: '/', permanent: true },
    //         { source: '/exclusion-zone-barriers', destination: '/', permanent: true },
    //         { source: '/stock-and-store-trolleys', destination: '/', permanent: true },
    //         { source: '/glass-restoration', destination: '/', permanent: true },
    //         { source: '/maintenance', destination: '/', permanent: true },
    //         { source: '/teamscareers', destination: '/', permanent: true },
    //     ]
    // },
}

module.exports = withBundleAnalyzer(nextConfig)
