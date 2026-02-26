This is a [Next.js](https://nextjs.org) project for TrustEdge Tax Services.

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

## Backend Setup (Supabase + Edge APIs)

1. Copy `.env.example` to `.env.local` and set required variables.
2. Apply SQL migrations in `supabase/migrations/*` to your Supabase project.
3. Run the app with `npm run dev`.

### Required environment variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_BASIC_AUTH_USER`
- `ADMIN_BASIC_AUTH_PASS`

### Optional environment variables

- `RESEND_API_KEY`
- `NOTIFICATION_EMAIL_FROM`
- `NOTIFICATION_EMAIL_TO`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_BUSINESS_NUMBER`
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_TEMPLATE_NAME`
- `WHATSAPP_TEMPLATE_LANGUAGE`
- `ZOOM_ACCOUNT_ID`
- `ZOOM_CLIENT_ID`
- `ZOOM_CLIENT_SECRET`
- `ZOOM_USER_ID`
- `GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_DRIVE_PRIVATE_KEY`
- `GOOGLE_DRIVE_ROOT_FOLDER_ID`
- `INTERNAL_JOB_RUNNER_TOKEN`
- `NEXT_PUBLIC_DEFAULT_TIMEZONE`

### Integration endpoints

- WhatsApp webhook verify + ingest: `GET/POST /api/whatsapp/webhook`
- Background worker runner: `POST /api/internal/integration-jobs/run`

For the worker runner, send either `Authorization: Bearer <INTERNAL_JOB_RUNNER_TOKEN>` or
`x-job-runner-token: <INTERNAL_JOB_RUNNER_TOKEN>`.

Recommended schedule: call the worker endpoint every 1 minute from your platform cron system.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
