# Professional Referral System - Implementation Summary

## ✅ COMPLETED FEATURES

### 1. Database Schema ✅
**Migration**: `00009_professional_referrals.sql` (already exists, ready to apply)

**Tables Created**:
- `mental_health_professionals` - Directory of verified therapists/counselors
- `user_referrals` - Tracks all referral requests
- `referral_alerts` - Admin notifications for high-risk cases

**Features**:
- Row Level Security (RLS) enabled
- Proper indexes for performance
- Auto-updated timestamps

---

### 2. Automatic Referral Trigger ✅

**Integration Points**:
- `/api/v1/assessment/screening` - Creates referral after initial screening
- `/api/v1/assessment/social` - Creates referral after social function assessment

**Behavior**:
- Automatically triggers for **high** or **imminent** risk users
- Creates referral record in database
- Creates admin alert for immediate attention
- Sends crisis resources email (async, non-blocking)
- Prevents duplicate referrals

**New API Endpoints**:
- `POST /api/v1/referral/create` - Creates referral and alert
- `POST /api/v1/email/send-crisis-resources` - Sends emergency email

---

### 3. Crisis Resources Email ✅

**Features**:
- Bilingual (EN/MS) support
- Malaysian crisis hotlines:
  - **Befrienders KL**: 03-7627 2929 (24/7)
  - **Talian Kasih**: 15999 (24/7)
  - **MIASA Helpline**: 1800-820-066
- Urgent banner for imminent risk cases
- Professional referral confirmation
- Referral ID tracking

**Template**: HTML email with responsive design

---

### 4. Enhanced Emergency Modal ✅

**File**: `/src/components/emergency/emergency-modal.tsx`

**New Features**:
- Shows referral confirmation badge
- Indicates 24-48 hour response time
- Bilingual messages
- Green confirmation banner when referral created

**Props**:
```typescript
interface EmergencyModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canClose?: boolean;
  referralCreated?: boolean; // NEW
}
```

---

## 📂 FILES CREATED

```
src/app/api/v1/referral/
├── create/
│   └── route.ts                    # Create referral endpoint

src/app/api/v1/email/
└── send-crisis-resources/
    └── route.ts                    # Crisis email sender
```

---

## 📝 FILES MODIFIED

1. **src/lib/assessment/triage.ts**
   - Already had `createReferralForHighRiskUser()` function (unchanged)

2. **src/app/api/v1/assessment/screening/route.ts**
   - Added automatic referral trigger
   - Calls `createReferralForHighRiskUser()` for high/imminent risk

3. **src/app/api/v1/assessment/social/route.ts**
   - Added automatic referral trigger
   - Checks for existing referrals (no duplicates)
   - Creates referral if overall risk is high/imminent

4. **src/components/emergency/emergency-modal.tsx**
   - Added `referralCreated` prop
   - Shows green confirmation banner
   - Bilingual support for referral messages

---

## 🔄 HOW IT WORKS

### Flow Diagram:
```
User completes assessment
       ↓
Triage detects HIGH/IMMINENT risk
       ↓
[AUTOMATIC TRIGGERS]
├─→ Create referral record (user_referrals table)
├─→ Create admin alert (referral_alerts table)
├─→ Send crisis resources email (with hotlines)
└─→ Show emergency modal (with referral confirmation)
       ↓
Admin receives alert in dashboard
Admin contacts user within 24-48 hours
Admin connects user with professional
```

---

## 🎯 NEXT STEPS (Pending)

### 1. Professional Directory UI
- Browse professionals page
- Filter by location, specialization, language
- Professional profile cards
- "Request Referral" button

### 2. Referral Request Form
- User-initiated referral requests
- Preference selection (in-person, phone, video)
- Language preference
- Notes field

### 3. Admin Referral Dashboard
- View all referral alerts
- Mark alerts as read/actioned
- Update referral status
- Assign professionals to referrals
- Track completion

---

## 🧪 TESTING CHECKLIST

Before going live, test:

1. **High-Risk User Flow**:
   - [ ] Complete screening with "thoughts of death" = Yes
   - [ ] Verify referral created in database
   - [ ] Check admin alert created
   - [ ] Confirm crisis email sent
   - [ ] Emergency modal shows referral confirmation

2. **Imminent Risk User Flow**:
   - [ ] Complete screening with "ending life" = Yes
   - [ ] Emergency modal shows (cannot close)
   - [ ] Referral created automatically
   - [ ] Email sent with URGENT banner
   - [ ] Admin alert marked as "imminent_risk"

3. **No Duplicate Referrals**:
   - [ ] Complete assessment twice
   - [ ] Verify only ONE referral created

4. **Email Deliverability**:
   - [ ] Test email sending to real address
   - [ ] Check spam score
   - [ ] Verify hotline links work
   - [ ] Test both EN and MS versions

---

## 🚀 DEPLOYMENT STEPS

1. **Apply Database Migration**:
   ```bash
   # You said you'll apply to production directly
   npx supabase db push
   ```

2. **Verify Environment Variables**:
   ```env
   # Email (already configured)
   RESEND_API_KEY=...
   NEXT_PUBLIC_FROM_EMAIL=...

   # Supabase (already configured)
   NEXT_PUBLIC_SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

3. **Test in Staging**:
   - Complete full high-risk assessment
   - Verify email received
   - Check database records

4. **Deploy to Production**:
   - Merge feature branch
   - Deploy to Vercel
   - Monitor error logs

---

## 📊 SUCCESS METRICS

Track these after launch:

- **Referral Creation Rate**: % of high-risk users with auto-referrals
- **Email Delivery Rate**: % of emails successfully delivered
- **Admin Response Time**: Time to first contact
- **Referral Completion Rate**: % of referrals that result in user seeing professional
- **User Safety**: No incidents from users who received referrals

---

## 🔐 SECURITY NOTES

- ✅ RLS policies ensure users can only see own referrals
- ✅ Service role used for admin operations
- ✅ User can only create referrals for themselves
- ✅ Email content sanitized
- ✅ Referral data encrypted at rest (Supabase default)

---

## 💡 FUTURE ENHANCEMENTS

- SMS notifications for imminent risk (Twilio integration)
- WhatsApp integration for Malaysian users
- Video call scheduling with professionals
- Automatic follow-up emails at 24h, 48h, 72h
- Referral outcome tracking (user feedback)
- Professional ratings and reviews

---

**Status**: Core referral system COMPLETE ✅
**Remaining**: UI components (directory, request form, admin dashboard)
