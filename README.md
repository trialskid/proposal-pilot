# 🚀 ProposalPilot

**AI-Powered Proposal & Estimate Generator for Service Businesses**

Create professional, detailed proposals in minutes using AI. Describe your project in plain English and get a complete proposal with scope, timeline, pricing, and terms — ready to send to clients.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss)

## ✨ Features

- **🤖 AI Proposal Generation** — GPT-4 generates complete proposals from plain text descriptions
- **📋 Industry Templates** — Pre-configured for General Contractor, Landscaping, Cleaning, IT Services, Marketing, Consulting
- **✏️ Full Proposal Editor** — Edit every section before sending
- **🔗 Client Portal** — Shareable links for clients to view proposals
- **✍️ E-Signatures** — Digital signature capture for proposal acceptance
- **📊 Analytics** — Track views, time spent, and acceptance rates
- **📄 PDF Export** — Professional PDF generation
- **📱 Responsive** — Works on desktop, tablet, and mobile
- **🔐 Authentication** — Secure sign up/login with credentials

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js |
| AI | OpenAI GPT-4 |
| Deployment | Docker, Vercel |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (or Docker)
- OpenAI API key (optional — works in demo mode without it)

### Option 1: Docker Compose (Recommended)

```bash
git clone https://github.com/YOUR_USERNAME/proposal-pilot.git
cd proposal-pilot
cp .env.example .env
# Edit .env with your OpenAI key (optional)
docker-compose up -d
```

### Option 2: Local Development

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/proposal-pilot.git
cd proposal-pilot
npm install

# Setup environment
cp .env.example .env
# Edit .env — set DATABASE_URL to your postgres instance

# Setup database
npx prisma migrate dev
npx prisma db seed

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Account
- **Email:** demo@proposalpilot.com
- **Password:** demo123

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth
│   │   ├── proposals/    # CRUD + generate
│   │   ├── portal/       # Client portal endpoints
│   │   └── user/         # Profile management
│   ├── auth/             # Sign in/up pages
│   ├── dashboard/        # Main dashboard
│   ├── proposals/        # Proposal views & editor
│   ├── portal/           # Client-facing portal
│   └── settings/         # Business profile
├── components/           # React components
├── lib/                  # Utilities, Prisma, OpenAI, templates
└── ...
prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Demo seed data
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Random secret for auth | ✅ |
| `NEXTAUTH_URL` | App URL (http://localhost:3000) | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for AI generation | ❌ (demo mode) |
| `NEXT_PUBLIC_APP_URL` | Public app URL | ✅ |

## 🏗 Industry Templates

- 🏗️ General Contractor
- 🌿 Landscaping
- ✨ Cleaning Services
- 💻 IT Services
- 📈 Marketing Agency
- 💼 Consulting

## 📝 License

MIT — see [LICENSE](LICENSE)
