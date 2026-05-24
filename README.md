# 🎓 StudyGig — Student Academic Marketplace

> The complete student ecosystem combining Fiverr + LinkedIn + Discord for India's students.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor → run the full schema from `supabase/schema.sql`
3. Enable Google OAuth in Authentication → Providers
4. Copy your project URL and anon key

### 3. Configure Environment
```bash
cp .env.local.example .env.local
# Fill in your Supabase credentials
```

### 4. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

## 📁 Project Structure

```
studygig/
├── app/                          # Next.js 14 App Router
│   ├── page.tsx                  # Landing page
│   ├── auth/
│   │   ├── login/page.tsx        # Login (email + Google OAuth)
│   │   ├── register/page.tsx     # 3-step registration with role selection
│   │   └── callback/route.ts     # OAuth callback handler
│   ├── dashboard/
│   │   ├── layout.tsx            # Sidebar + topbar layout
│   │   ├── student/page.tsx      # Student dashboard
│   │   ├── tutor/page.tsx        # Tutor dashboard
│   │   ├── writer/page.tsx       # Writer dashboard
│   │   ├── companion/page.tsx    # Companion dashboard
│   │   ├── project/page.tsx      # Project developer dashboard
│   │   └── admin/page.tsx        # Admin analytics dashboard
│   ├── orders/
│   │   ├── new/page.tsx          # Advanced 4-step order creation
│   │   └── [id]/page.tsx         # Order detail + chat + timeline
│   ├── marketplace/page.tsx      # Browse all gigs/skills
│   ├── demand-board/page.tsx     # Post & browse requests
│   ├── sessions/page.tsx         # Session management + calendar
│   ├── wallet/page.tsx           # Wallet, escrow, transactions
│   ├── social/page.tsx           # Academic social feed
│   ├── companion-match/page.tsx  # Smart study partner matching
│   ├── skill-market/page.tsx     # List and browse skills
│   ├── profile/page.tsx          # User profile + badges + reviews
│   └── help/page.tsx             # FAQ + tickets + live chat
├── components/                   # Reusable components
├── lib/
│   ├── supabase.ts               # Supabase client
│   ├── supabase-server.ts        # Server-side Supabase
│   ├── utils.ts                  # Helpers + constants
│   ├── pricing.ts                # Dynamic pricing engine
│   └── mock-data.ts              # Demo data
├── store/index.ts                # Zustand global state
├── types/index.ts                # TypeScript types
├── supabase/schema.sql           # Complete DB schema
└── middleware.ts                 # Auth middleware
```

## 🎯 Features Built

### ✅ Core Platform
- [x] Landing page with animated hero
- [x] Google OAuth + Email authentication
- [x] 3-step role-based registration
- [x] Responsive sidebar dashboard layout
- [x] Role-specific dashboards (Student, Tutor, Writer, Companion, Project Dev, Admin)

### ✅ Marketplace
- [x] Browse all gigs with filters, search, sort
- [x] Grid + list view toggle
- [x] Category, verified-only, rating filters
- [x] Demand board — post & browse requests
- [x] Proposal system with pricing

### ✅ Orders
- [x] 4-step dynamic order creation flow
- [x] Category-specific fields (writing pages, tutor sessions, project stack)
- [x] Live animated pricing engine with urgency multipliers
- [x] Escrow visualization
- [x] Order detail page with timeline + chat
- [x] Dispute resolution flow

### ✅ Sessions
- [x] Session booking modal
- [x] Calendar view
- [x] Join session via Google Meet links
- [x] Reschedule flow
- [x] Star rating + review system
- [x] Session history

### ✅ Wallet
- [x] Balance, escrow, pending payout cards
- [x] Add funds (UPI, Card, Net Banking, Paytm/GPay)
- [x] Withdraw flow
- [x] Transaction history with filters
- [x] Monthly earnings bar chart
- [x] Export statement

### ✅ Social
- [x] Academic social feed (LinkedIn-style)
- [x] Post types: update, achievement, doubt, project, resource
- [x] Like, comment, save, share
- [x] Trending tags sidebar
- [x] Suggested people to follow
- [x] Create post modal

### ✅ Companion Matching
- [x] Smart match scoring algorithm
- [x] Filter by personality, availability, subjects
- [x] Partner profile view with compatibility score
- [x] Study preferences modal
- [x] Send connection request

### ✅ Gamification
- [x] XP system with level progression
- [x] Study streak tracking
- [x] Achievement badges (earned + locked)
- [x] Leaderboard
- [x] XP progress bar

### ✅ Profile
- [x] Cover photo + avatar
- [x] Bio editing inline
- [x] Stats (orders, rating, followers, earnings)
- [x] Badges grid (earned/locked)
- [x] Reviews with rating breakdown
- [x] Activity chart
- [x] Declared skills

### ✅ Help & Support
- [x] Live chat widget with bot responses
- [x] Open support ticket modal
- [x] Ticket tracking with status
- [x] Collapsible FAQ
- [x] Priority support tiers

### ✅ Admin
- [x] Revenue + user growth charts
- [x] Category distribution pie chart
- [x] User management table
- [x] Fraud detection panel
- [x] Payment commission breakdown

## 🔧 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google OAuth + Email)
- **Realtime**: Supabase Realtime
- **State**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **UI**: Tailwind CSS + Radix UI
- **Icons**: Lucide React
- **Toasts**: React Hot Toast
- **Forms**: React Hook Form + Zod

## 🎨 Design System
- Dark-first design (#080814 base)
- Brand color: Indigo (#6366f1)
- Custom animations (float, shimmer, glow, fade-in)
- Category-specific themes (writing=amber, tutor=blue, project=brand, companion=pink)
- Glassmorphism cards with blur effects
- Mesh gradient backgrounds

## 📦 Deployment

### Vercel (Recommended)
```bash
npx vercel --prod
# Set env vars in Vercel dashboard
```

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
```
