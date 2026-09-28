# Netlify deployment guide

## Architecture

GitHub stores the source code and Netlify builds/hosts the Next.js app. Netlify automatically supports the Next.js App Router and Route Handlers through its OpenNext adapter.

The app uses two external services from secure Netlify server-side code:
- OpenAI for the optional AI summary enhancement.
- Resend for transactional email delivery.

Payment is intentionally manual: customers scan the supplied UPI QR, pay ₹50, tick the payment confirmation box, enter their delivery email and submit. The app does not verify UPI payments automatically.

## 1. Create the GitHub repository

1. Sign in to GitHub.
2. Create a new repository, for example `resume-builder`.
3. Keep it public if you want the simplest free GitHub workflow.
4. Upload/push the complete project folder.

Example Git commands:

```bash
git init
git add .
git commit -m "Netlify-ready ResumeCraft app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Do **not** commit `.env.local` or any API key.

## 2. Create the Netlify site

1. Sign in to Netlify.
2. Choose **Add new project / Import an existing project**.
3. Select GitHub.
4. Authorize Netlify to access the repository.
5. Select the `resume-builder` repository.
6. Netlify should detect Next.js automatically.
7. Build command: `npm run build`.
8. Let Netlify use the detected Next.js publish settings.
9. Deploy the site.

The included `netlify.toml` also sets Node.js 22 and the build command.

## 3. Add environment variables

In Netlify, open your site and go to **Project configuration → Environment variables**. Add:

```text
NEXT_PUBLIC_APP_NAME=ResumeCraft
NEXT_PUBLIC_PRICE_INR=50
NEXT_PUBLIC_UPI_ID=vishal6705@kotak
NEXT_PUBLIC_UPI_NAME=VISHAL
NEXT_PUBLIC_OWNER_EMAIL=indiaislove75@gmail.com
OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=ResumeCraft <your-verified-address@yourdomain.com>
```

`OPENAI_API_KEY` and `RESEND_API_KEY` are server-side secrets. Never put them in a `NEXT_PUBLIC_*` variable.

After changing environment variables, trigger a new deploy so the new values are applied.

## 4. Configure Resend

The application uses Resend to send the clean PDF.

1. Create/sign in to your Resend account.
2. Create an API key.
3. Verify a domain you control.
4. Use an address on that verified domain as `RESEND_FROM_EMAIL`.

For example:

```text
RESEND_FROM_EMAIL=ResumeCraft <resume@yourdomain.com>
```

The owner receives the applicant details and PDF. The applicant also receives the clean PDF at the delivery email they entered.

## 5. Configure OpenAI

1. Create an OpenAI API key.
2. Put it in Netlify as `OPENAI_API_KEY`.
3. Optionally set `OPENAI_MODEL` if you want to use a different model.

The browser never receives the OpenAI API key.

## 6. Payment flow

The included QR is the supplied Kotak UPI QR for `vishal6705@kotak`.

Customer flow:

1. Fill in the resume.
2. Optionally use AI to improve the summary.
3. See the watermarked preview.
4. Scan the QR and pay ₹50.
5. Tick **I have paid ₹50**.
6. Enter the email where the clean resume should be delivered.
7. Submit.

There is no UTR field and no automatic payment verification. You manually compare submissions against your UPI/bank payment notifications.

## 7. Test the live site

Run one complete test after deployment:

- Open the Netlify URL.
- Fill a test resume.
- Test AI summary enhancement.
- Confirm the preview is watermarked before payment confirmation.
- Scan/pay ₹50 if you want to test the real payment flow.
- Tick the payment confirmation box.
- Enter an email you can access.
- Submit.
- Confirm the owner email arrives with the PDF.
- Confirm the applicant delivery email arrives with the same clean PDF.

## 8. Custom domain (optional)

You can connect a domain you own from Netlify's domain settings. Netlify will guide you through the DNS configuration and HTTPS setup.

## 9. GitHub auto-deploy

Once GitHub is connected, future pushes to the configured production branch automatically trigger a new Netlify deployment.

Typical workflow:

```text
Edit code
   ↓
git add .
   ↓
git commit -m "Update resume builder"
   ↓
git push
   ↓
Netlify builds and deploys automatically
```

## 10. Important production notes

- Add rate limiting/bot protection before advertising the site widely.
- Add a privacy policy because applicants submit personal information.
- Do not log full resume data unnecessarily.
- Keep OpenAI and Resend keys only in Netlify environment variables.
- Keep checking ₹50 payments manually because the app only records the customer's confirmation; it does not prove that a UPI payment succeeded.
