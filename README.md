# AnimeTarget | Millennium Archive 🛰️

<div align="center">

![AnimeTarget Banner](https://via.placeholder.com/1200x400/0b1622/3db4f2?text=AnimeTarget+Millennium+Archive)

**The Ultimate Anime Tracking Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](https://animetarget.vercel.app) · [Report Bug](https://github.com/voidx3d/anime-tracker/issues) · [Request Feature](https://github.com/voidx3d/anime-tracker/issues)

</div>

---

## 🌟 Features

### 🎯 **Core Functionality**
- **10,000+ Anime Archive** - Comprehensive database with real-time AniList synchronization
- **Neural Recommendations** - AI-powered suggestions based on your watch history and genre preferences
- **Multi-Status Tracking** - Organize anime into Watching, Completed, Planning, On-Hold, and Dropped
- **Advanced Search & Filters** - Find anime by title, genre, year, score, and more
- **Dual-View Library** - Switch between grid and list layouts instantly

### 🎨 **Premium Design**
- **Glass-Industrial Aesthetic** - Modern glassmorphism with industrial command-center vibes
- **Multi-Chromatic Themes** - Choose from Millennium (default), Cyberpunk, and Monochrome
- **Cinematic Loading States** - Smooth skeleton screens and scanning animations
- **Micro-Animations** - Staggered entries, hover blooms, and floating badges
- **Fully Responsive** - Optimized for desktop, tablet, and mobile

### 🚀 **Advanced Features**
- **Spotlight Carousel** - Auto-rotating hero showcase of trending anime
- **Neural Reroll** - Get fresh recommendations with high-entropy randomization
- **Mission Control** - Import/export your anime lists with diff detection
- **Real-Time Sync** - Dual-table architecture ensures 100% data integrity
- **Server-Side Pagination** - Lightning-fast performance even with massive datasets

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1 (App Router) |
| **Language** | TypeScript 5.0 |
| **Database** | Supabase (PostgreSQL) |
| **Styling** | Tailwind CSS 4.0 |
| **Animations** | Framer Motion |
| **Data Source** | AniList GraphQL API |
| **Deployment** | Vercel / Cloudflare Pages |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm/yarn/pnpm
- Supabase account
- AniList API access (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/voidx3d/anime-tracker.git
   cd anime-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

4. **Set up the database**
   
   Run the SQL schema in your Supabase project:
   ```sql
   -- See docs/database-schema.sql for the complete schema
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
anime-tracker/
├── public/              # Static assets (favicon, images, manifest)
├── scripts/             # Data ingestion and sync scripts
│   ├── scrape-anilist.ts
│   ├── surgical-sync.ts
│   └── final-extraction.ts
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── anime/      # Anime detail pages
│   │   ├── library/    # Main library view
│   │   ├── suggestions/# Neural recommendations
│   │   ├── dashboard/  # Analytics dashboard
│   │   └── import/     # Mission Control (import/export)
│   ├── components/     # Reusable React components
│   │   ├── AnimeCard.tsx
│   │   ├── NeuralImage.tsx
│   │   ├── SpotlightCarousel.tsx
│   │   ├── NeuralSuggestions.tsx
│   │   └── ...
│   ├── lib/            # Utilities and helpers
│   │   ├── supabaseClient.ts
│   │   └── diffEngine.ts
│   └── types/          # TypeScript type definitions
├── docs/               # Documentation
└── README.md
```

---

## 🎮 Usage

### Tracking Anime
1. Navigate to **Library** to view your collection
2. Use the **status tabs** to filter by Watching, Completed, etc.
3. Toggle between **Grid** and **List** views
4. Click any anime card for detailed information

### Neural Recommendations
1. Visit the **Suggestions** page
2. Click **Reroll Strategy** for fresh recommendations
3. Recommendations are based on your completed/planned anime genres

### Importing Data
1. Go to **Mission Control** (Import page)
2. Upload your AniList/MyAnimeList export JSON
3. Review the diff and apply changes
4. Your library will sync automatically

### Switching Themes
1. Click the **theme toggle** in the navbar
2. Choose from Millennium, Cyberpunk, or Monochrome
3. Your preference is saved to localStorage

---

## 🔧 Configuration

### Database Schema
The application uses two main tables:
- `animes` - Main anime archive with metadata and user status
- `user_anime_lists` - Legacy repository for backward compatibility

See `docs/database-schema.sql` for the complete schema.

### Environment Variables
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |

---

## 📊 Performance

- **10,000+ anime** indexed and searchable
- **Server-side pagination** for instant load times
- **Image optimization** with Next.js Image component
- **Lazy loading** for off-screen content
- **Efficient caching** with Supabase query optimization

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy .next
```

### Environment Setup
Ensure all environment variables are configured in your deployment platform.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **AniList** for the comprehensive anime database API
- **Supabase** for the powerful backend infrastructure
- **Next.js** team for the incredible framework
- **Vercel** for seamless deployment

---

## 📧 Contact

**VoidX3D** - [@voidx3d](https://github.com/voidx3d)

Project Link: [https://github.com/voidx3d/anime-tracker](https://github.com/voidx3d/anime-tracker)

---

<div align="center">

**Made with 🛰️ by VoidX3D**

[⬆ Back to Top](#animetarget--millennium-archive-)

</div>