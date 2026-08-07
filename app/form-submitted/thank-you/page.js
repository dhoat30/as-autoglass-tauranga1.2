export const revalidate = 2592000; // applies to both page and metadata

import Header from '@/Components/UI/Header/Header';
import ThankYou from '@/Components/UI/ThankYou/ThankYou';
import { siteUrl } from '@/site.config';

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: 'Thank You',
    robots: {
        index: false,
        follow: true,
        nocache: true,
        googleBot: {
            index: false,
            follow: true,
            noimageindex: false,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default async function Page() {
    const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "07 543 0009";

    return (
        <>
            <Header />
            <main>
                <ThankYou phone={phone} />
            </main>
        </>

    )
}
