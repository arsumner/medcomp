# MedComp

MedComp is a pay transparency platform for healthcare workers to anonymously share and compare real compensation data by profession, location, and hospital.

Healthcare workers often rely on vague job postings, word of mouth, or outdated salary sites to understand whether they are being paid fairly. MedComp gives nurses, allied health professionals, therapists, imaging staff, pharmacy workers, lab professionals, and other healthcare workers a simple way to browse real pay reports and contribute their own data without creating an account.

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

### Browse by Profession

MedComp supports 60+ healthcare roles across categories including:

- Nursing
- Allied health
- Therapy
- Imaging
- Pharmacy
- Laboratory
- Respiratory care
- Surgical services
- Emergency services

### Browse by Location

Users can explore compensation data geographically through state and city-level views, including:

- Average base rates by state
- Top cities by pay
- Submission counts by location
- Interactive United States map

### Recent Reports Feed

The homepage includes a recent reports feed showing the latest anonymous compensation submissions from across the country.

### Hospital-Based Search

Users can search for hospitals and facilities using Google Maps Places data, making submissions more consistent and easier to browse.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui |
| Database | Supabase / PostgreSQL |
| Tables | TanStack React Table |
| Charts | Recharts |
| Maps | React Simple Maps |
| Hospital search | Google Maps Places API |
| Package manager | pnpm |

## Project Structure

```txt
medcomp/
├── app/
│   ├── components/
│   │   ├── locationsClient.tsx
│   │   ├── professionsClient.tsx
│   │   └── ...
│   ├── locations/
│   │   └── page.tsx
│   ├── professions/
│   │   └── page.tsx
│   ├── submit/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── public/
├── styles/
└── README.md
```

## Data Model

MedComp is built around anonymous salary submissions connected to hospitals and healthcare professions.

Core data includes:

- **Submissions** — compensation reports submitted by healthcare workers
- **Hospitals** — facility name, city, state, and location data
- **Professions** — healthcare roles and categories
- **Differentials** — optional pay additions such as night shift, evening shift, charge, certification, and preceptor pay

## Key Pages

| Page | Description |
|---|---|
| `/` | Homepage with platform overview and recent salary reports |
| `/submit` | Anonymous compensation submission form |
| `/professions` | Browse compensation data by healthcare role |
| `/locations` | Compare pay by state, city, and region |
| `/hospitals` | Explore salary reports by hospital or facility |

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm
- Supabase project
- Google Maps Places API key

### Install Dependencies

```bash
pnpm install
```

### Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Run the Development Server

```bash
pnpm dev
```

Then open:

```txt
http://localhost:3000
```

## Why I Built This

I built MedComp because healthcare compensation is often difficult to evaluate from the outside. Job postings usually show broad pay ranges, and many healthcare workers have to rely on scattered conversations to understand what fair pay actually looks like.

As a nurse and software developer, I wanted to create a platform that makes healthcare pay data easier to share, compare, and understand without requiring users to create an account or provide personally identifying information.

## Roadmap

Planned improvements include:

- Advanced filtering by specialty, experience, shift, and facility type
- Hospital profile pages with compensation summaries
- More detailed differential breakdowns
- Pay trend visualizations over time
- Moderation tools for data quality
- Exportable insights for users comparing job offers
- Expanded role coverage across healthcare professions

## Privacy

MedComp is designed around anonymous sharing. Users are not required to create an account, and submissions are intended to show compensation trends without exposing personal identity.

## Status

MedComp is currently in active development.
