# Splendid Client

Customer-facing Splendid Packaging portal built with Next.js Pages Router, Firebase, Ant Design, and Tailwind CSS.

## What It Does

- Customer authentication with Firebase Auth
- Dashboard with shipment summaries
- Shipment listing and receipt view
- Customer profile management
- Shipping cost calculator
- API routes for Firebase Admin user provisioning and custom claims

## Tech Stack

- Next.js 12
- React 18
- Firebase client SDK
- Firebase Admin SDK
- Ant Design 4
- Tailwind CSS 3

## Requirements

- Node.js 18+
- npm
- A Firebase project with:
  - Authentication enabled
  - Firestore enabled
  - Storage enabled
- EmailJS credentials for referral and onboarding emails

## Environment Setup

Copy [.env.example](c:/work/splendid-client/.env.example) to `.env.local` and fill in the values.

### Public client variables

These are used by the browser-side Firebase client and EmailJS integration:

```env
NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_FIREBASE_EMAILJS_PUBLIC_KEY=
```

### Server-only admin variables

These are used only by the Next.js API routes through `firebase-admin`:

```env
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=
```

For `FIREBASE_PRIVATE_KEY`, keep escaped newlines in `.env.local`, for example:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Temporary compatibility note:

- The code still accepts legacy `NEXT_PUBLIC_FIREBASE_*` admin secret names for now.
- Those names should be removed from local and deployed environments and replaced with server-only `FIREBASE_*` names.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## Important Project Notes

- Protected pages currently use a client-side auth guard in [hoc/withAuth.js](c:/work/splendid-client/hoc/withAuth.js).
- Firebase Admin initialization lives in [config/firebase-admin.js](c:/work/splendid-client/config/firebase-admin.js).
- Firebase client initialization lives in [config/firebase-config.js](c:/work/splendid-client/config/firebase-config.js).
- API routes for account creation and claims assignment live under [pages/api](c:/work/splendid-client/pages/api).

## Current Known Gaps

- No automated tests are present yet.
- Registration and profile flows still need correctness hardening.
- The project is still on the Pages Router and an older Next.js version.
- Some UI strings have encoding issues that should be cleaned up.

## Upgrade Direction

Recommended order:

1. Stabilize auth, registration, and API error handling.
2. Keep env handling server-safe and fully documented.
3. Upgrade the existing Pages Router app to a modern Next.js baseline.
4. Migrate incrementally from `pages/` to `app/`.
