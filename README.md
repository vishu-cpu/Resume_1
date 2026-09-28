# ResumeCraft — ₹50 AI Resume Builder

A Netlify-ready Next.js resume builder for creating clean, professional PDF resumes.

## Features

- Multi-step resume form
- Personal/contact information
- LinkedIn, GitHub and portfolio
- AI-enhanced professional summary
- Experience and internship entries
- 10th, 12th, Diploma, ITI, Graduation, Post Graduation and other education
- Skills, achievements, certifications, languages, hobbies
- Expected salary and notice period
- Live watermarked resume preview
- ₹50 UPI QR payment screen using the supplied QR
- Manual payment checking — no automatic UPI verification
- Server-side clean PDF generation
- Email of the clean PDF to the applicant
- Email of the submission details and PDF to `indiaislove75@gmail.com`

## Payment flow

The supplied QR is a static UPI QR for `vishal6705@kotak`. The customer scans it, pays ₹50, ticks **I have paid ₹50**, enters the delivery email and submits. There is intentionally no UTR field and no automated payment verification.

The owner receives the submission and clean PDF. The applicant receives the clean PDF at the delivery email. You manually compare submissions with your own UPI/bank payment notification.

## Stack

- Next.js 16
- React 19
- TypeScript
- `@react-pdf/renderer`
- OpenAI Responses API
- Resend
- Zod

## Local setup

1. Install Node.js 22+.
2. Copy `.env.example` to `.env.local`.
3. Add your OpenAI and Resend keys.
4. Run:

```bash
npm install
npm run dev
```

5. Open `http://localhost:3000`.

## Netlify deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the complete GitHub → Netlify setup, environment variables, Resend configuration, testing checklist and custom-domain steps.

Netlify supports the Next.js App Router and Route Handlers through its OpenNext adapter, so no separate Vercel deployment is required.

## Environment variables

Copy `.env.example` to `.env.local` for local development. In production, set the same variables in Netlify's environment-variable settings.

Never expose `OPENAI_API_KEY` or `RESEND_API_KEY` through a `NEXT_PUBLIC_*` variable.
