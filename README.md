# MedComp

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](./LICENSE)

MedComp is a pay transparency platform for healthcare workers to anonymously share and compare real compensation data by profession, location, and hospital.

Healthcare workers often rely on vague job postings, word of mouth, or outdated salary sites to understand whether they are being paid fairly. MedComp gives nurses, allied health professionals, respiratory therapists, imaging staff, pharmacy workers, lab professionals, and other healthcare workers a simple way to browse real pay reports and contribute their own data without creating an account.

## Why I Built This

As a nurse and software developer, I saw both sides of the problem: job postings show broad, often meaningless pay ranges, and workers are left piecing together fair-pay estimates from scattered conversations. MedComp gives healthcare workers a direct, anonymous way to share and compare real compensation data with no account or personally identifying information required.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Key Pages & Routes](#key-pages--routes)
- [API Routes](#api-routes)
- [Getting Started](#getting-started)
- [Roadmap](#roadmap)
- [Privacy](#privacy)

## Overview

MedComp helps healthcare workers answer questions like:

- What are people in my role actually making?
- How does pay compare across states, cities, and hospital systems?
- Are differentials, charge pay, certification pay, or sign-on bonuses common in my area?
- How does my base rate compare to similar workers nearby?

Users can browse anonymous salary submissions, explore location-based pay trends, and submit their own compensation report in under two minutes.

## Features

### Anonymous Compensation Submissions

Workers can submit pay data without creating an account. Each report can include:

- Profession and specialty
- Base hourly rate
- Hospital or facility
- City and state
- Employment type
- Experience level
- Shift type
- Night, evening, charge, certification, and preceptor differentials
- Sign-on bonus information

Submissions are rate-limited (via Upstash) to help prevent spam and abuse.

### Browse by Profession

MedComp supports 60+ healthcare roles across categories including:

- Nursing
- Advanced Practitioners
- Physical, Speech, and Occupational Therapy
- Imaging
- Pharmacy
- Laboratory
- Respiratory care
- Surgical services
- Healthcare IT

### Browse by Location

Users can explore compensation data geographically through state and city-level views, including:

- Median base rates by location
- Top cities/states by pay
- Submission counts by location
- Interactive map of the US

### Hospital-Based Search

Users can search for hospitals and facilities using Google Maps Places data, and browse individual hospital pages with reported compensation data.

### Recent Reports Feed

The homepage includes a recent reports feed showing the latest anonymous compensation submissions from across the country.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI library | React 19 |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui, Base UI |
| Database | Supabase / PostgreSQL |
| Tables | TanStack React Table |
| Charts | Recharts |
| Maps | React Simple Maps, @vis.gl/react-google-maps |
| Hospital search | Google Maps Places API |
| Rate limiting | Upstash Redis / Ratelimit |
| Package manager | pnpm |

## Project Structure

The Next.js app lives inside the `my-app/` directory.

```txt
medcomp/
└── my-app/
    ├── app/
    │   ├── api/
    │   │   ├── hospitals/route.ts
    │   │   ├── location/route.ts
    │   │   ├── roles/route.ts
    │   │   └── submissions/route.ts
    │   ├── components/
    │   │   ├── filters/cityFilters.tsx
    │   │   ├── forms/hospitalSearch.tsx
    │   │   ├── forms/submissionForm.tsx
    │   │   ├── home/hero.tsx
    │   │   ├── home/featureWalkthrough.tsx
    │   │   ├── layout/navbar.tsx
    │   │   ├── layout/footer.tsx
    │   │   ├── locations/locationsClient.tsx
    │   │   ├── locations/stateClient.tsx
    │   │   ├── locations/cityClient.tsx
    │   │   ├── map/UsMap.tsx
    │   │   └── table/
    │   ├── data/
    │   │   ├── departments.ts
    │   │   ├── professions.ts
    │   │   └── states.ts
    │   ├── hooks/usePlacesAutocomplete.ts
    │   ├── city/[slug]/page.tsx
    │   ├── state/[slug]/page.tsx
    │   ├── location/[slug]/page.tsx
    │   ├── hospital/[slug]/page.tsx
    │   ├── profession/[slug]/page.tsx
    │   ├── submit/page.tsx
    │   ├── submit/thankyou/page.tsx
    │   ├── about/page.tsx
    │   ├── contact/page.tsx
    │   ├── privacy/page.tsx
    │   ├── terms/page.tsx
    │   ├── layout.tsx
    │   └── page.tsx
    ├── src/
    │   ├── assets/          # profession/category illustrations
    │   ├── components/ui/   # shared shadcn/ui primitives
    │   └── lib/
    │       ├── supabase.ts
    │       ├── ratelimit.ts
    │       └── utils.ts
    └── public/
```

## Data Model

MedComp is built around anonymous salary submissions connected to hospitals and healthcare roles.

```
Hospital                Role
--------                ----
hospitalID (PK)         roleID (PK)
name                     department
city                     profession
state                    license_type
      \                    /
       \                  /
        \                /
              Submission
              ----------
              submissionID (PK)
              hospitalID (FK)
              roleID (FK)
              pay_type
              base_rate
              years_experience
              night_diff / charge_diff / evening_diff
              preceptor_pay / certification_pay
              signon_bonus
              submitted_at
```

Each submission is an anonymous compensation report linked to one hospital and one role.

## Key Pages & Routes

| Route | Description |
|---|---|
| `/` | Homepage with platform overview and recent salary reports |
| `/submit` | Anonymous compensation submission form |
| `/submit/thankyou` | Confirmation page after a submission |
| `/profession`, `/profession/[slug]` | Browse compensation data by healthcare role |
| `/location`, `/location/[slug]` | Compare pay by location |
| `/state/[slug]` | State-level compensation breakdown |
| `/city`, `/city/[slug]` | City-level compensation breakdown |
| `/hospital`, `/hospital/[slug]` | Explore salary reports by hospital or facility |
| `/about` | About the project |
| `/contact` | Contact page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of use |

## API Routes

| Route | Description |
|---|---|
| `/api/submissions` | Create and fetch anonymous compensation submissions |
| `/api/hospitals` | Search/fetch hospital and facility data |
| `/api/location` | Location (state/city) aggregate data |
| `/api/roles` | Profession/role reference data |

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm
- Supabase project
- Google Maps Places API key
- Upstash Redis database (for rate limiting)

### Install Dependencies

```bash
cd my-app
pnpm install
```

### Set Up Environment Variables

Create a `.env.local` file inside `my-app/`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### Run the Development Server

```bash
pnpm dev
```

Then open:

```
http://localhost:3000
```

## Roadmap

Planned improvements include:

- Advanced filtering by specialty, experience, shift, and facility type
- Hospital profile pages with compensation summaries
- Cost of living and tax comparisons
- Pay trend visualizations over time
- Moderation tools for data quality

## Privacy

MedComp is designed around anonymous sharing. Users are not required to create an account, and submissions are intended to show compensation trends without exposing personal identity.

## Status

MedComp is currently in active development.
