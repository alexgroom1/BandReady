# BandReady

A Next.js 14 app with TypeScript and Tailwind CSS, configured for **tablet-landscape-first design** (1024×768 base).

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (1024×768 design tokens)
- **Framer Motion** – animations
- **Lucide React** – icons
- **shadcn/ui** – reusable UI primitives

## Project Structure

```
/app              — Next.js app router pages
/components/ui    — Reusable UI primitives (shadcn)
/components/screens — Full-page screen components
/lib              — Data models and utilities
/public/audio     — Audio assets
/public/images    — Mascot and instrument images
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding shadcn Components

```bash
npx shadcn@latest add [component-name]
```

## Design

- **Base viewport:** 1024×768 (tablet landscape)
- **CSS variables:** `--design-width`, `--design-height`
- **Tailwind:** `min-w-design-width`, `min-h-design-height`, `max-w-design-width`
