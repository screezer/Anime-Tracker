# AnimeTarget Documentation

Welcome to the AnimeTarget Millennium Archive documentation! This guide will help you understand, deploy, and contribute to the project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Reference](#api-reference)
5. [Deployment](#deployment)
6. [Contributing](#contributing)

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm/yarn/pnpm
- Supabase account
- Basic knowledge of Next.js and TypeScript

### Local Development Setup

1. Clone and install:
   ```bash
   git clone https://github.com/voidx3d/anime-tracker.git
   cd anime-tracker
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. Set up database:
   - Create a new Supabase project
   - Run the SQL schema from `docs/database-schema.sql`
   - Configure RLS policies if needed

4. Start development server:
   ```bash
   npm run dev
   ```

---

## Architecture

### Tech Stack
- **Frontend**: Next.js 16.1 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4.0, Framer Motion
- **Backend**: Supabase (PostgreSQL), Server Actions
- **Data Source**: AniList GraphQL API

### Key Design Decisions

#### Server-Side Rendering
All data-heavy pages use Next.js Server Components for optimal performance:
- `/library` - Server-side pagination
- `/anime/[id]` - Dynamic metadata generation
- `/suggestions` - Client-side for reroll interactivity

#### Dual-Table Architecture
- `animes` table: Primary source of truth with `ustatus` field
- `user_anime_lists` table: Legacy compatibility layer

#### Neural Recommendations
Algorithm weights:
- Genre affinity: 50%
- Average score: 30%
- Popularity: 20%
- Random entropy: High (300 units) for diverse rerolls

---

## Database Schema

### Tables

#### `animes`
Primary anime archive with 10,000+ entries.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | AniList ID (primary key) |
| title_romaji | TEXT | Romaji title |
| title_english | TEXT | English title |
| ustatus | TEXT | User status (TO_WATCH, COMPLETED, etc.) |
| genres | TEXT[] | Array of genres |
| average_score | INTEGER | Score out of 100 |
| popularity | INTEGER | Popularity rank |

#### `user_anime_lists`
Legacy user tracking table.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Auto-increment ID |
| anime_id | BIGINT | Foreign key to animes |
| status | TEXT | User status |

See `database-schema.sql` for the complete schema.

---

## API Reference

### Server Actions

#### `uploadAndDiff(formData: FormData)`
Processes imported anime lists and calculates diff.

**Parameters:**
- `formData`: File upload containing JSON export

**Returns:**
```typescript
{
  success: boolean;
  diffs?: DiffItem[];
  error?: string;
}
```

#### `applyChange(diff: DiffItem)`
Applies a single change from the diff.

**Parameters:**
- `diff`: Diff item to apply

**Returns:**
```typescript
{
  success: boolean;
  error?: string;
}
```

### Supabase Queries

#### Fetch User Library
```typescript
const { data } = await supabase
  .from('animes')
  .select('*')
  .not('ustatus', 'is', null)
  .order('title_english');
```

#### Neural Recommendations
```typescript
const { data } = await supabase
  .from('animes')
  .select('*')
  .is('ustatus', null)
  .gte('average_score', 60)
  .order('popularity', { ascending: false })
  .limit(300);
```

---

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
3. Deploy!

```bash
vercel --prod
```

### Cloudflare Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Cloudflare:
   ```bash
   npx wrangler pages deploy .next
   ```

3. Configure environment variables in Cloudflare dashboard

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Yes | Service role key (server-side only) |

---

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow the existing component structure
- Use Tailwind CSS utilities (avoid inline styles)
- Add comments for complex logic

### Commit Messages
Follow conventional commits:
```
feat: add neural reroll button
fix: resolve image loading issue
docs: update README
style: refine glassmorphism effects
```

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a PR with a clear description

---

## Troubleshooting

### Common Issues

**Images not loading:**
- Verify image domains in `next.config.ts`
- Check Supabase storage permissions

**Database connection errors:**
- Confirm environment variables are set
- Check Supabase project status

**Build failures:**
- Clear `.next` cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

---

## License

MIT License - see LICENSE file for details.

---

**Questions?** Open an issue on GitHub or contact [@voidx3d](https://github.com/voidx3d)
