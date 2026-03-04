# Habit Tracker - Project Context

> This file provides context for Claude Code sessions. Start by asking Claude to read this file.

## Project Overview

A habit tracking web app built as a learning project and portfolio piece for GitHub.

**Repository:** https://github.com/DocInTech/habit-tracker

## Tech Stack (Decisions Made)

| Technology | Choice | Why |
|------------|--------|-----|
| Framework | Vue 3 | User's workplace uses Vue; portfolio demonstration |
| UI Library | Vuetify | Pre-built Material Design components, speeds up development |
| Backend | Supabase | Easier than Firebase, uses standard PostgreSQL, open source |
| Database | Supabase PostgreSQL | Comes with Supabase |
| Authentication | Supabase Auth | Email/password enabled; Google OAuth planned |
| Styling | Vuetify (Material Design) | Consistent, professional look |

## Current Status

### Completed Features
- [x] Project setup (Vue 3 + Vite + Vuetify)
- [x] User authentication (email/password with confirmation)
- [x] Add new habits
- [x] View all habits
- [x] Mark habits complete for today
- [x] Delete habits
- [x] Daily progress bar
- [x] Protected routes (redirect to login if not authenticated)
- [x] Pushed to GitHub

### Not Yet Implemented
- [ ] Google OAuth sign-in (partially configured, needs Google Cloud setup)
- [ ] Streak tracking (consecutive days)
- [ ] Weekly/monthly view
- [ ] Dark mode
- [ ] Deploy to Vercel/Netlify

## Future Plans (V2)

**AI-Based Feature** (user's idea):
- Goal assessment - analyze user's habits
- Suggest habits to add or remove
- Track progress over time with insights
- This should be kept in mind when structuring code

## Project Structure

```
habit_tracker/
├── src/
│   ├── plugins/
│   │   ├── vuetify.js    # Vuetify configuration
│   │   └── supabase.js   # Supabase client
│   ├── router/
│   │   └── index.js      # Vue Router with auth guards
│   ├── views/
│   │   ├── LoginView.vue # Login/signup page
│   │   └── HomeView.vue  # Main habit tracker
│   ├── App.vue           # Root component
│   └── main.js           # Entry point
├── .env                  # Supabase credentials (not in git)
├── .env.example          # Template for credentials
└── package.json
```

## Database Schema

**Table: habits**
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- name: TEXT
- completions: TEXT[] (array of date strings like '2026-03-04')
- created_at: TIMESTAMP
```

Row Level Security enabled - users can only access their own habits.

## Environment Setup

1. Copy `.env.example` to `.env`
2. Add Supabase credentials (URL and anon key)
3. Run `npm install`
4. Run `npm run dev`

**Note:** Requires Node.js 20+ (use nvm: `nvm use 20`)

## Supabase Configuration

- **Project URL:** https://dzugqrulcsboedpunoem.supabase.co
- **Auth providers:** Email/password enabled, Google pending
- **Email confirmation:** Required (user must confirm email before login)

## Known Issues / Notes

1. Node.js version warnings may appear but app works fine with Node 20
2. Google sign-in button exists in UI but won't work until OAuth is configured
3. The signup flow shows a success message asking users to confirm email

## Branching Strategy

```
dev → sit → uat → prod
```

| Branch | Purpose |
|--------|---------|
| dev | Active development (default branch) |
| sit | System Integration Testing |
| uat | User Acceptance Testing |
| prod | Production release |

**Workflow:** Code moves up through branches via pull requests/merges.

## Development Environment

- **Node.js:** v20.20.0 (installed via nvm)
- **nvm:** Installed at `~/.config/nvm`
- **GitHub CLI:** Installed and authenticated as `DocInTech`
- **To start dev server:**
  ```bash
  export NVM_DIR="$HOME/.config/nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  npm run dev
  ```

## User's Learning Goals

1. Learn JavaScript through building
2. Learn Vue.js (used at workplace)
3. Build portfolio projects for GitHub
4. Learn git branching and code promotion workflows (dev → sit → uat → prod)
5. Future: Add AI-based features

## Session History

**Session 1 (2026-03-04):**

*Planning Phase:*
- Decided on platform: Web app
- Decided on language: JavaScript
- Decided on framework: Vue 3 (workplace uses Vue, portfolio demonstration)
- Initially considered Firebase, switched to Supabase (user preference)
- Chose Firestore-style approach with Supabase PostgreSQL
- Auth: Email/password + Google (Google OAuth deferred for later)
- UI: Vuetify (Material Design components)
- Core features: Add, view, complete, delete habits

*Implementation:*
- Created Vue 3 + Vite project
- Added Vuetify, Vue Router, Supabase
- Upgraded Node.js from 18 to 20 via nvm (required by Vite 7)
- Built LoginView.vue with email/password auth
- Built HomeView.vue with habit CRUD operations
- Added email confirmation success message after signup
- User tested app successfully - all features working

*DevOps:*
- Installed GitHub CLI (`gh`)
- Authenticated as DocInTech
- Created repo: https://github.com/DocInTech/habit-tracker
- Set up branching strategy: dev → sit → uat → prod
- Removed `main` branch, `dev` is now default working branch
- Created this context file for session continuity

*Next Session TODO:*
- [ ] Add Google OAuth sign-in
- [ ] Add streak tracking (consecutive days)
- [ ] Practice code promotion: merging dev → sit → uat → prod
- [ ] Deploy to Vercel or Netlify
- [ ] Later: AI-based goal assessment feature
