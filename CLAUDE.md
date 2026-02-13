# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog ("林林多喝水") built with Next.js 15+ (App Router) that uses Notion as a headless CMS. The blog fetches posts dynamically from a Notion database via the Notion API and renders them as static pages.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Data Layer

**Core Abstraction:** The `lib/posts.ts` module provides a unified interface for fetching posts with automatic fallback:
- **Primary:** Notion API (when `NOTION_API_KEY` and `NOTION_DATABASE_ID` are configured)
- **Fallback:** Hardcoded demo posts in `lib/posts.ts`
- All `app/*` pages should import from `lib/posts.ts` (NOT `lib/notion-posts.ts` directly)

**Notion Integration:**
- `lib/notion-posts.ts` - Notion client and post fetching logic
- `lib/notion.ts` - Lower-level Notion API wrappers
- `lib/notion-utils.ts` - Converts Notion blocks to Markdown

**Post Schema** (defined in both `lib/posts.ts` and `lib/notion-posts.ts`):
```typescript
interface Post {
  id: string;
  title: string;
  date: string;        // ISO date string
  dateDisplay: string; // Formatted for display (zh-CN)
  slug: string;
  content?: string;
  summary?: string;
  tags?: string[];
  category?: string;
  updated?: string;
  status?: string;
  featured?: boolean;
  readingTime?: number;
  coverImage?: string;
  published?: boolean;
}
```

### Routing Structure

All routes use Next.js App Router with async components and dynamic segments:

- `app/page.tsx` - Homepage with paginated post list (7 posts per page)
- `app/posts/[slug]/page.tsx` - Individual post pages
- `app/about/page.tsx` - About page
- `app/skills/page.tsx` - Skills page
- `app/life/page.tsx` - Life category
- `app/books/page.tsx` - Books category ("乱翻书")
- `app/world/page.tsx` - World category ("看天下")
- `app/gallery/page.tsx` - Gallery page ("图展")

### Styling

- **Framework:** Tailwind CSS v4 (PostCSS-based)
- **Fonts:** Google Fonts - Merriweather Sans (headers), Open Sans (body)
- **Custom CSS:** `app/globals.css` includes prose styling for article content
- **Primary Color:** `#1b8b62` (green)
- **Background:** `#fafafa` (light gray)

### Content Rendering

- Post content from Notion is fetched as Markdown
- `app/posts/[slug]/page.tsx` includes a `formatMarkdown()` function that converts Markdown to HTML
- Custom prose styles in `app/globals.css` handle typography for rendered content

### Notion Database Configuration

**Environment Variables** (`.env.local`, not in git):
```
NOTION_API_KEY=secret_*
NOTION_DATABASE_ID=32-char-id
```

**Database Properties:**
- **Name** (title) - Article title
- **Slug** (rich_text) - URL identifier (currently auto-generated from title if not provided)
- **Date** (date) - Publish date
- **Published** (checkbox) - Must be checked to appear on site
- **Summary**, **Tags** (multi_select), **Category** (select), **Status**, **Featured**, **Reading Time**, **Cover Image** - Optional

**Important:** The slug is currently auto-generated from the title in `lib/notion-posts.ts:69` by replacing spaces with hyphens and lowercasing. If the Notion database has a proper Slug property, update this logic to use it instead.

## Path Aliases

- `@/*` maps to project root (configured in `tsconfig.json`)
- Imports use this alias: `@/lib/posts`, `@/app/page.tsx`, etc.

## ESLint Configuration

- Uses `eslint-config-next` with TypeScript support
- Configured in `eslint.config.mjs` (flat config format)
- Overrides default ignores for `.next/`, `out/`, `build/`, and `next-env.d.ts`
