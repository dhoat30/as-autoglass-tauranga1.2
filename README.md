This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Booking conversion tracking

Set `GTM_ID` to your Google Tag Manager web container ID (`GTM-…`) in the
environment used to run or deploy the site. The root layout loads this container
once for the whole site. If the ID is missing or invalid, the container is not
loaded; successful form events can still be queued in `window.dataLayer`.

The Book Now and Send Photo forms push `form_submission` only after the API
confirms success, before navigating to the thank-you page:

```js
{
  event: "form_submission",
  form_id: "book_now", // "send_photo" for the photo assessment form
  form_name: "Book Now", // "Send Photo" for the photo assessment form
  submission_type: "booking", // "photo_assessment" for Send Photo
  service: "Windscreen replacement",
  page_path: "/book-now",
  photo_attached: false
}
```

The event does not include names, contact details, registration numbers,
messages, photos, or URL query parameters. Validation errors, failed API
responses and honeypot submissions do not generate conversion events. Repeated
submits are ignored while a request is in flight or after it succeeds.

In GTM, add a **Custom Event** trigger with event name `form_submission` and
connect it to the intended Google Ads conversion tag or GA4 event tag. To count
only booking requests, add a Data Layer Variable named `form_id` and require it
to equal `book_now`. Use GTM Preview to verify the trigger and destination tag
before publishing the container. Avoid counting the same lead again with a
separate thank-you page conversion tag.

The booking page has a shorter form with expandable optional details, a booking
anchor at `#booking-form`, mobile Call / Book controls and FAQs. A submitted form
is a booking request; appointment availability and pricing are confirmed by the
team.

The optional preferred date uses a date-only picker and accepts today or a future
date in New Zealand. It keeps the existing HubSpot `booking_date__time` property,
stored at UTC midnight for the selected date. Notes and notification emails show
the calendar date only; the team arranges the appointment time directly.
