# MyMental - Mental Health Assessment Platform

## Project Overview

MyMental is a comprehensive mental health assessment and support platform built for the Malaysian population. It provides culturally-appropriate mental health screening tools, AI-powered insights, and self-help interventions.

**Tech Stack:**
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Supabase (PostgreSQL + Auth)
- **AI:** Anthropic Claude API with RAG (Retrieval-Augmented Generation)
- **Styling:** Glass morphism UI design system with dark mode support
- **i18n:** Bilingual support (English & Bahasa Malaysia)

---

## Core Features

### 1. Mental Health Assessments

**Malaysian-Validated Screening Instruments:**

| Assessment | Instrument | Items | Scale |
|------------|-----------|-------|-------|
| Depression | PHQ-9 (Malay validated) | 9 | 0-27 |
| Anxiety | AST (Ujian Saringan Anzieti) | 19 | 0-76 |
| Insomnia | SEGIST | 11 | 0-44 |
| PTSD | Senarai Semak PTSD | 20 | 0-80 |
| Suicidal Ideation | YSAS (Yatt Suicide Attitude Scale) | 10 | 0-40 |
| OCD | OCD Screening Tool Malaysia | 20 | 0-80 |
| Psychosis | Prodromal Psychosis Screening | 6 | 0-24 |
| Sexual Addiction | Sexual Behavior Screening | 5 | 0-20 |
| Marital Distress | Marital Distress Questionnaire | 10 | 0-50 |

**Assessment Flow:**
1. Initial Screening (Yes/No questions for condition detection)
2. Social Function Assessment (Likert scale)
3. Optional Registration
4. Detailed Assessment (based on detected conditions)
5. Results with AI-powered insights

### 2. Real-Time Triage System

**Risk Levels:**
- `imminent` - Immediate danger (suicidal ideation) → Emergency modal, crisis resources
- `high` - Urgent concern → Warning, professional help recommendation
- `moderate` - Concerning → Resource provision
- `low` - Normal flow

**Safety Features:**
- Real-time risk detection on every answer
- Emergency modal with crisis hotlines (Malaysia)
- Chat blocking for high-risk users
- Automatic triage event logging

### 3. AI-Powered Features

**Chat Support:**
- Claude-powered conversational AI
- RAG integration with knowledge base
- Context-aware responses based on assessment results
- Safety guardrails for crisis situations

**Insights Generation:**
- Personalized analysis based on assessment scores
- Culturally-appropriate recommendations
- Bilingual output (EN/MS)

### 4. Self-Help Interventions

**Intervention Modules:**
- Structured self-help programs with chapters
- Video introductions
- Exercise-based activities
- Progress tracking per user
- Premium/free content tiers

### 5. Subscription & Billing

**Plans:**
- Free tier (basic assessments)
- Premium Monthly (RM29.90/month)
- Premium Yearly (RM299/year)
- Pay-per-assessment option

**Payment Integration:**
- Simulation mode for development
- Ready for Stripe/Billplz integration

---

## Application Pages

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, testimonials |
| `/about` | About the platform |
| `/pricing` | Subscription plans |
| `/resources` | Crisis resources and self-help links |
| `/emergency` | Emergency crisis information |
| `/login` | User authentication |
| `/register` | New user registration |

### Assessment Flow
| Route | Description |
|-------|-------------|
| `/start` | Begin assessment journey |
| `/screening` | Initial screening questions |
| `/social` | Social function assessment |
| `/results/preliminary` | Preliminary results |
| `/test/[type]` | Detailed assessment by type |
| `/test/[type]/results` | Detailed results |

### User Dashboard
| Route | Description |
|-------|-------------|
| `/my-assessments` | User's assessment history |
| `/chat` | AI chat support |
| `/interventions` | Self-help modules list |
| `/interventions/[id]` | Individual intervention module |
| `/account` | Account settings |
| `/billing` | Subscription management |
| `/checkout` | Payment processing |

### Admin Dashboard
| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard home |
| `/admin/users` | User management |
| `/admin/assessments` | Assessment data viewer |
| `/admin/alerts` | Risk alerts management |
| `/admin/crisis` | Crisis events monitoring |
| `/admin/interventions` | Intervention content management |
| `/admin/kb` | Knowledge base articles |
| `/admin/subscriptions` | Subscription management |
| `/admin/reports` | Analytics and reports |
| `/admin/audit` | Audit logs |
| `/admin/settings` | System settings |
| `/admin/data` | Data export tools |

---

## API Endpoints

### Assessment APIs (`/api/v1/assessment/`)
- `POST /start` - Start new assessment
- `POST /save` - Save assessment answers
- `GET /results` - Get assessment results
- `POST /screening` - Save initial screening
- `POST /social` - Save social function screening
- `POST /register` - Register user during flow
- `GET /insights` - Get AI-generated insights
- `GET /recommendations` - Get personalized recommendations

### Other APIs
- `POST /api/v1/chat` - AI chat endpoint
- `GET/POST /api/v1/payment` - Payment processing
- `GET/DELETE /api/v1/subscription` - Subscription management
- `POST /api/v1/screening/save` - Save screening results
- `GET /api/v1/intervention/modules` - Get intervention modules
- `GET/POST /api/v1/intervention/progress` - Track user progress

### Admin APIs (`/api/admin/`)
- `GET/PUT /api/admin/settings` - System settings
- `POST /api/admin/log-access` - Audit logging
- `POST /api/admin/logout` - Admin logout

---

## Database Schema

**6 Migrations:**

1. `00001_initial_schema.sql` - Core tables (users, assessments, screenings, triage_events)
2. `00002_kb_articles_pgvector.sql` - Knowledge base with vector embeddings for RAG
3. `00003_payments_subscriptions.sql` - Payments, subscriptions, plans
4. `00004_interventions.sql` - Intervention modules, chapters, user progress
5. `00005_admin_system.sql` - Admin users, audit logs, crisis alerts
6. `00006_system_settings.sql` - System configuration settings

**Key Tables:**
- `users` - User profiles with demographics
- `assessments` - Assessment records with scores
- `initial_screenings` - Initial screening data
- `social_function_screenings` - Social function scores
- `triage_events` - Risk detection events
- `kb_articles` - Knowledge base content
- `interventions` - Self-help modules
- `intervention_chapters` - Module chapters
- `user_intervention_progress` - Progress tracking
- `payments` - Payment records
- `subscriptions` - User subscriptions
- `admin_users` - Admin accounts
- `admin_audit_log` - Audit trail
- `system_settings` - Platform configuration

---

## Component Library

### UI Components (`/components/ui/`)
- `GlassCard` - Glass morphism card component
- `GlassButton` - Styled button with variants
- `GlassInput` - Form input component
- `GlassModal` - Modal dialog
- `ConfirmModal` - Confirmation dialog (replaces browser confirm)
- `AlertModal` - Alert dialog (replaces browser alert)
- `ProgressBar` / `ProgressSteps` - Progress indicators
- `RiskBadge` / `SeverityBadge` - Status badges

### Feature Components
- `/components/assessment/` - Assessment UI (LikertScale, etc.)
- `/components/admin/` - Admin dashboard components
- `/components/intervention/` - Intervention UI (VideoPlayer, ExerciseCard)
- `/components/premium/` - Premium features (InsightsPreview, PremiumGate)
- `/components/layout/` - Header, Footer, Navigation
- `/components/emergency/` - Emergency modal and resources

---

## State Management

**Zustand Store (`/stores/assessment-store.ts`):**
- Assessment flow state
- Screening answers (initial + social)
- Detected conditions
- Risk levels
- Demographics
- Step navigation

---

## Internationalization

**Supported Languages:**
- English (en)
- Bahasa Malaysia (ms)

**Translation Files:**
- `/src/i18n/messages/en.json`
- `/src/i18n/messages/ms.json`

All assessment instruments include bilingual questions and response options.

---

## Security Features

1. **Row Level Security (RLS)** - All database tables protected
2. **Admin Role System** - admin vs super_admin permissions
3. **Audit Logging** - All admin actions logged
4. **Triage Event Tracking** - Risk events recorded
5. **Input Validation** - Zod schemas for all inputs
6. **CSRF Protection** - Built into Next.js

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic AI
ANTHROPIC_API_KEY=

# Payment (when ready)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations on Supabase
- [ ] Configure Supabase Auth providers
- [ ] Set up payment gateway (Stripe/Billplz)
- [ ] Configure domain and SSL
- [ ] Set up monitoring/analytics
- [ ] Test all assessment flows
- [ ] Verify crisis resources are up-to-date

---

## Future Enhancements (Roadmap)

1. **Payment Integration** - Stripe/Billplz for Malaysian payments
2. **Mobile App** - React Native companion app
3. **Therapist Portal** - Professional dashboard for clinicians
4. **Group Interventions** - Facilitated group therapy modules
5. **Wearable Integration** - Connect with health devices
6. **Advanced Analytics** - Population health insights
7. **API for Partners** - Integration with healthcare providers

---

## Credits

Built with culturally-validated Malaysian mental health instruments:
- AST (Anxiety Screening Tool) - Malaysian validation
- SEGIST (Shazli Ezzat Ghazali Insomnia Screening Test)
- YSAS (Yatt Suicide Attitude Scale)
- Malaysian PTSD Checklist
- Malaysian OCD Screening Tool

---

*Last Updated: December 15, 2025*
