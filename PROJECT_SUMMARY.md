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

## Implementation Status (December 16, 2025)

### 💰 CURRENT PRICING STRUCTURE

**Active Plans (3 tiers only):**
- **Free** - RM0 (Initial screening, basic features)
- **Premium - 6 Months** - RM29 (All premium features for 6 months)
- **Premium - Yearly** - RM45 (All premium features for 12 months, best value)

**Note:** All monthly plans (Basic Monthly RM19, Premium Monthly RM49) have been **REMOVED**. Platform now only offers 6-month and yearly premium subscriptions.

---

### ✅ FULLY IMPLEMENTED SYSTEMS

#### Assessment System (100% Complete)
- ✓ All 9 Malaysian assessment instruments with complete question sets
- ✓ PHQ-9, AST, SEGIST, OCD, PTSD, YSAS, Psychosis, Sexual Addiction, Marital Distress
- ✓ Complete scoring algorithms with severity ranges
- ✓ Real-time triage system (low/moderate/high/imminent risk levels)
- ✓ Emergency detection and crisis resources
- ✓ AI-powered insights generation with RAG
- ✓ Results pages with comprehensive data visualization
- ✓ Premium/free tier access control
- ✓ Bilingual support (EN/MS)

#### Professional Referral System (100% Complete)
- ✓ Mental health professionals directory with comprehensive schema
- ✓ Automatic referral triggers for high/imminent risk users
- ✓ User-initiated referral requests
- ✓ Admin referral management dashboard with workflow
- ✓ Crisis email notifications with Malaysian hotlines
- ✓ Referral alerts system
- ✓ Database schema with RLS security

#### Intervention System (95% Complete)
- ✓ Video integration (YouTube/Vimeo) with react-player
- ✓ Complete quiz system (4 question types, grading, attempts)
- ✓ Chapter and module-level progress tracking
- ✓ Premium content gating (module and chapter level)
- ✓ Exercise system with step-by-step guidance
- ⚠ Lottie animations (database ready, library installed, UI not integrated)

#### Email System (90% Complete)
- ✓ Resend integration with verified domain (noreply@kitamen.my)
- ✓ Assessment results email template
- ✓ Crisis resources email (bilingual)
- ✓ Professional React Email templates
- ❌ Payment confirmation/receipt emails missing

#### Admin Dashboard (90% Complete)
- ✓ User management (search, pagination, CRUD)
- ✓ System alerts monitoring
- ✓ Comprehensive audit logs
- ✓ Reports & analytics with visualizations
- ✓ Data export/import (JSON/CSV)
- ✓ Settings panel (general, notifications, security, API keys)
- ✓ Intervention viewing
- ❌ Intervention CRUD interface missing
- ❌ Quiz builder for admins missing

### ⚠️ PARTIALLY IMPLEMENTED SYSTEMS

#### Payment & Subscription System (40% Complete)
- ✓ Complete database schema with webhooks table
- ✓ Simulation mode fully functional for testing
- ✓ Checkout UI with Stripe/FPX options
- ✓ Subscription viewing and basic cancellation
- ✓ Pricing tiers configured: Premium 6 Months (RM29), Premium Yearly (RM45)
- ✓ Premium content gating throughout platform
- ❌ Stripe integration code missing (infrastructure only)
- ❌ Billplz integration not implemented at all
- ❌ Payment gateway router missing
- ❌ Webhook handlers not implemented
- ❌ Upgrade/downgrade functionality missing
- ❌ 2nd screening payment gate not implemented
- ❌ Real payment processing returns 501 error

### ❌ NOT IMPLEMENTED FROM PLAN

#### Missing Features:
1. **Real Payment Processing**
   - No Stripe API integration (only infrastructure prepared)
   - No Billplz integration
   - No webhook endpoints (database ready)
   - No payment gateway router

2. **Payment Gate on 2nd Screening**
   - Explicitly marked as TODO in progress tracker
   - No payment check between screening and detailed assessment

3. **Subscription Management**
   - No plan switching (6 Months ↔ Yearly)
   - No upgrade/downgrade flows
   - No proration handling

4. **Admin Content Creation Tools**
   - No quiz/assessment builder interface
   - No intervention editor (create/edit modules and chapters)
   - No video/animation upload interface

5. **Payment Emails**
   - No receipt/confirmation email template
   - No refund notification emails

### 📊 OVERALL IMPLEMENTATION STATUS

| Category | Status | Percentage |
|----------|--------|-----------|
| Core Assessment System | Complete | 100% |
| Referral System | Complete | 100% |
| Intervention System | Nearly Complete | 95% |
| Email System | Nearly Complete | 90% |
| Admin Dashboard | Nearly Complete | 90% |
| **Payment System** | **Infrastructure Only** | **40%** |
| Dark Mode & UI | Complete | 100% |
| Database Schema | Complete | 100% |
| Security (RLS) | Complete | 100% |

**Production Ready Systems:** Assessment, Referrals, Interventions (user-facing), Email
**Requires Work:** Real payment processing, Admin content tools, Payment emails

---

## Recent Updates (December 16, 2025)

### Dark Mode Implementation ✅
- **Completed:** Full dark mode support with theme toggle
- **Changes:**
  - Added `next-themes` for theme management
  - Created `ThemeToggle` component with animated sun/moon icons
  - Floating theme toggle button (bottom-right corner)
  - Updated all UI components (GlassButton, GlassModal, GlassCard, GlassInput) for dark mode
  - Configured Tailwind v4 dark mode variant (`@variant dark`)
  - Simplified background to solid colors (white for light, off-black for dark)
  - Added global CSS overrides for text visibility in dark mode
  - CSS variables for theming (backgrounds, text, borders, shadows)
- **Default:** Light mode (system preference disabled)
- **⚠️ REQUIRES TESTING:** Full platform testing in both light and dark modes

### Email Domain Configuration ✅
- **Completed:** Updated email sending to use verified domain
- **Changes:**
  - Changed from `onboarding@resend.dev` to `noreply@kitamen.my`
  - Updated all email sending functions (OTP, assessment results)
- **⚠️ REQUIRES TESTING:** Email deliverability testing for OTP codes and results

### Emergency Modal Updates ✅
- **Completed:** Emergency modal now closable at all risk levels
- **Changes:**
  - Removed forced modal lock for imminent risk (suicidal ideation)
  - Users can now close emergency modal and save progress
- **⚠️ REQUIRES TESTING:** Crisis flow testing, ensure resources are still visible

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
- Premium - 6 Months (RM29 for 6 months)
- Premium - Yearly (RM45/year)
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

## QA Testing Requirements

### 🔴 Critical - Requires Professional Testing

#### 1. Crisis Management & Triage System
- [ ] **Imminent Risk Detection** - Test suicidal ideation triggers
- [ ] **Emergency Modal** - Verify closable modal still shows resources
- [ ] **Crisis Hotlines** - Verify all Malaysian crisis numbers are current
- [ ] **Risk Level Escalation** - Test all triage pathways (low → moderate → high → imminent)
- [ ] **Chat Blocking** - Verify high-risk users cannot access chat
- [ ] **Triage Event Logging** - Confirm all risk events are logged in database

#### 2. Dark Mode Functionality
- [ ] **Theme Toggle** - Test toggle button on all pages
- [ ] **Text Visibility** - Check all text is readable in both modes
- [ ] **Component Styling** - Verify all UI components in dark mode:
  - [ ] GlassButton (all variants)
  - [ ] GlassCard (all variants)
  - [ ] GlassModal (default & emergency variants)
  - [ ] GlassInput (all states: default, focus, error, disabled)
  - [ ] Navigation menus
  - [ ] Footer
  - [ ] Admin dashboard
- [ ] **Background Colors** - Verify solid colors (white/off-black, no gradients)
- [ ] **Forms** - Test all forms in dark mode (login, register, assessments)
- [ ] **Assessment Flow** - Complete full assessment in dark mode
- [ ] **Mobile Responsiveness** - Test dark mode on mobile devices
- [ ] **Theme Persistence** - Verify theme preference is saved across sessions

#### 3. Email Delivery
- [ ] **OTP Codes** - Test magic link email delivery to various email providers:
  - [ ] Gmail
  - [ ] Outlook/Hotmail
  - [ ] Yahoo Mail
  - [ ] Malaysian providers (Maxis, TM, etc.)
- [ ] **Assessment Results** - Test results email after payment
- [ ] **Spam Filtering** - Check if emails land in spam folders
- [ ] **Email Content** - Verify bilingual content (EN/MS)
- [ ] **From Address** - Confirm `noreply@kitamen.my` displays correctly

#### 4. Assessment Accuracy
- [ ] **Scoring Algorithms** - Validate all assessment scoring:
  - [ ] PHQ-9 (Depression)
  - [ ] AST (Anxiety)
  - [ ] SEGIST (Insomnia)
  - [ ] PTSD Checklist
  - [ ] YSAS (Suicidal Ideation)
  - [ ] OCD Screening
  - [ ] Psychosis Screening
  - [ ] Sexual Addiction Screening
  - [ ] Marital Distress
- [ ] **Severity Classification** - Test threshold boundaries
- [ ] **Bilingual Consistency** - Ensure EN/MS versions produce same scores

### 🟡 High Priority - User Acceptance Testing

#### 5. User Experience
- [ ] **Assessment Flow** - Complete end-to-end assessment flow
- [ ] **Progress Saving** - Test auto-save and resume functionality
- [ ] **Mobile Experience** - Test on iOS and Android devices
- [ ] **Browser Compatibility** - Test on:
  - [ ] Chrome
  - [ ] Safari
  - [ ] Firefox
  - [ ] Edge
  - [ ] Mobile browsers
- [ ] **Language Switching** - Test EN ↔ MS switching mid-flow
- [ ] **Loading States** - Verify all async operations show loading indicators

#### 6. AI Features
- [ ] **Chat Support** - Test AI responses for appropriateness
- [ ] **RAG Integration** - Verify knowledge base retrieval works
- [ ] **Crisis Detection** - Test if AI detects crisis language
- [ ] **Safety Guardrails** - Verify AI refuses harmful requests
- [ ] **Insights Generation** - Test AI-generated insights quality

#### 7. Subscription & Payment
- [ ] **Payment Flow** - Test checkout process (simulation mode)
- [ ] **Subscription Management** - Test upgrade/downgrade flows
- [ ] **Premium Features** - Verify premium content access control
- [ ] **Payment Gate** - Test 2nd screening payment requirement (when implemented)

### 🟢 Standard Testing

#### 8. Authentication
- [ ] **Magic Link Login** - Test OTP code delivery and verification
- [ ] **Session Management** - Test session persistence and logout
- [ ] **Registration** - Test user registration flow
- [ ] **Account Settings** - Test profile updates

#### 9. Admin Dashboard
- [ ] **Admin Login** - Test admin authentication
- [ ] **User Management** - Test user CRUD operations
- [ ] **Alert Management** - Test crisis alert handling
- [ ] **Audit Logs** - Verify all admin actions are logged
- [ ] **Reports** - Test analytics and reporting features
- [ ] **Data Export** - Test data export functionality

#### 10. Interventions
- [ ] **Module Access** - Test free vs premium content access
- [ ] **Progress Tracking** - Test chapter completion tracking
- [ ] **Video Playback** - Test video player functionality
- [ ] **Exercise Completion** - Test exercise marking system

### 📋 Testing Checklist by User Type

#### Anonymous Users
- [ ] Can complete initial screening
- [ ] Can view preliminary results
- [ ] Cannot access chat or interventions
- [ ] Prompted to register for full features

#### Registered Users (Free)
- [ ] Can complete full assessments
- [ ] Can access free interventions
- [ ] Can use basic chat (with rate limits)
- [ ] Prompted to upgrade for premium features

#### Premium Users
- [ ] Can access all assessments
- [ ] Can access all interventions
- [ ] Unlimited chat access
- [ ] Can view detailed insights

#### Admin Users
- [ ] Can access admin dashboard
- [ ] Can manage users and content
- [ ] Can view alerts and logs
- [ ] Can export data

#### Super Admin Users
- [ ] All admin permissions
- [ ] Can manage other admins
- [ ] Can modify system settings
- [ ] Can access audit logs

---

## 🎯 Next Steps / Priority Tasks

### 🔴 CRITICAL - Payment Integration (Required for Launch)
1. **Stripe Integration**
   - Implement Stripe API calls in `/api/v1/payment/route.ts`
   - Add webhook handler at `/api/v1/payment/stripe/webhook/route.ts`
   - Test with Stripe test mode cards
   - Configure products in Stripe Dashboard for RM29 and RM45 plans

2. **Billplz Integration (Malaysian FPX)**
   - Implement Billplz API calls
   - Add webhook handler at `/api/v1/payment/billplz/webhook/route.ts`
   - Test with Billplz sandbox
   - Configure collection in Billplz Dashboard

3. **Payment Gate Implementation**
   - Add payment check in `/app/social/page.tsx` after 2nd screening
   - Redirect unpaid users to `/checkout?plan=premium_6months`
   - Create `/results/full` page for paid users only
   - Update preliminary results page to show upgrade prompt

### 🟡 HIGH PRIORITY - Platform Completion
1. **Admin Content Tools**
   - Build quiz builder interface for creating intervention quizzes
   - Build intervention editor (CRUD for modules and chapters)
   - Add video/media upload interface

2. **Email Templates**
   - Payment confirmation email (after successful payment)
   - Payment receipt email
   - Subscription renewal reminders

3. **Subscription Management**
   - Plan switching (6 months ↔ yearly)
   - Proration calculation
   - Cancellation flow improvements

### 🟢 MEDIUM PRIORITY - Enhancements
1. **Lottie Animations**
   - Add Lottie animation UI components in interventions
   - Upload animation library for breathing exercises, etc.

2. **Testing & QA**
   - Complete QA testing checklist from `/progress` page
   - Test all payment flows end-to-end
   - Cross-browser and mobile testing

3. **Performance Optimization**
   - Image optimization
   - Bundle size reduction
   - API response caching

---

## Credits

Built with culturally-validated Malaysian mental health instruments:
- AST (Anxiety Screening Tool) - Malaysian validation
- SEGIST (Shazli Ezzat Ghazali Insomnia Screening Test)
- YSAS (Yatt Suicide Attitude Scale)
- Malaysian PTSD Checklist
- Malaysian OCD Screening Tool

---

*Last Updated: December 16, 2025*
