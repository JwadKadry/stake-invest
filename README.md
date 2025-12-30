# Real Estate Investment Platform

פלטפורמת השקעות נדל"ן דומה ל-Stake, עם התמקדות ראשונית בהשקעות נדל"ן.

## ארכיטקטורה (Architecture)

### מבנה הפרויקט (Project Structure)

הפרויקט בנוי כמונורפו (Monorepo) עם הפרדה ברורה בין Frontend ו-Backend:

```
real-estate-investment-platform/
├── frontend/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/             # Next.js App Router (pages & layouts)
│   │   ├── components/      # React Components
│   │   ├── lib/             # Utilities & API clients
│   │   ├── types/           # TypeScript type definitions
│   │   ├── hooks/           # Custom React hooks
│   │   └── store/           # State management (Zustand)
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Node.js Backend API
│   ├── src/
│   │   ├── domains/         # Domain-driven design structure
│   │   │   ├── users/       # User domain
│   │   │   ├── properties/  # Property domain
│   │   │   └── investments/ # Investment domain
│   │   └── shared/          # Shared utilities
│   │       ├── database/    # DB connection & config
│   │       ├── middleware/  # Express middleware
│   │       └── types/       # Shared TypeScript types
│   ├── migrations/          # Database migrations
│   └── package.json
│
└── package.json             # Root package.json for monorepo scripts
```

### דומיינים עיקריים (Main Domains)

#### 1. Users Domain (דומיין משתמשים)
**תפקיד**: ניהול משתמשים, אימות והרשאות

**מבנה**:
- `models/userModel.ts` - גישה למסד הנתונים
- `services/authService.ts` - לוגיקת אימות (הרשמה, התחברות)
- `services/userService.ts` - לוגיקת משתמש (פרופיל, עדכונים)
- `routes/authRoutes.ts` - נתיבי API לאימות
- `routes/userRoutes.ts` - נתיבי API למשתמש

**תכונות**:
- הרשמה והתחברות
- ניהול פרופיל משתמש
- KYC Status (מצב אימות זהות)
- JWT Authentication

#### 2. Properties Domain (דומיין נכסים)
**תפקיד**: ניהול נכסי נדל"ן להשקעה

**מבנה**:
- `models/propertyModel.ts` - גישה למסד הנתונים
- `services/propertyService.ts` - לוגיקת עסקים לנכסים
- `routes/propertyRoutes.ts` - נתיבי API לנכסים

**תכונות**:
- רשימת נכסים עם פילטרים
- פרטי נכס בודד
- חיפוש נכסים
- ניהול מניות זמינות

#### 3. Investments Domain (דומיין השקעות)
**תפקיד**: ניהול השקעות של משתמשים בנכסים

**מבנה**:
- `models/investmentModel.ts` - גישה למסד הנתונים
- `services/investmentService.ts` - לוגיקת עסקים להשקעות
- `routes/investmentRoutes.ts` - נתיבי API להשקעות

**תכונות**:
- יצירת השקעה חדשה
- רשימת השקעות של משתמש
- סיכום השקעות (total invested, returns)
- ניהול סטטוס השקעות

### עקרונות ארכיטקטורה (Architecture Principles)

#### 1. Domain-Driven Design (DDD)
כל דומיין הוא עצמאי עם:
- **Models**: גישה ישירה למסד הנתונים
- **Services**: לוגיקת עסקים מורכבת
- **Routes**: נקודות קצה API

#### 2. Separation of Concerns
- **Frontend**: רק UI/UX ו-API calls
- **Backend**: לוגיקת עסקים, אימות, מסד נתונים
- **Shared Types**: הגדרות משותפות בין Frontend ו-Backend

#### 3. Type Safety
- TypeScript בכל הפרויקט
- Types מוגדרים ב-`types/domains.ts` (Frontend) ו-`shared/types/domains.ts` (Backend)
- Validation עם Zod

#### 4. Security
- JWT Authentication
- Password hashing עם bcrypt
- Middleware לאימות בכל נתיב מוגן
- CORS configuration

### מסד נתונים (Database Schema)

#### Tables:
1. **users** - משתמשים
   - id, email, password_hash, first_name, last_name, phone, date_of_birth, kyc_status

2. **properties** - נכסי נדל"ן
   - id, title, description, address fields, property_type, total_value, available_shares, share_price, min_investment, expected_annual_return, investment_term, status, images

3. **investments** - השקעות
   - id, user_id, property_id, shares, amount_invested, share_price, status, purchase_date, expected_return, actual_return

4. **documents** - מסמכים של נכסים
   - id, property_id, name, type, url, uploaded_at

### API Endpoints

#### Authentication
- `POST /api/auth/register` - הרשמה
- `POST /api/auth/login` - התחברות
- `POST /api/auth/refresh` - רענון טוקן

#### Users
- `GET /api/users/me` - פרופיל משתמש (מוגן)
- `PUT /api/users/me` - עדכון פרופיל (מוגן)
- `GET /api/users/me/investments` - השקעות של משתמש (מוגן)
- `GET /api/users/me/investments/summary` - סיכום השקעות (מוגן)

#### Properties
- `GET /api/properties` - רשימת נכסים (עם פילטרים)
- `GET /api/properties/:id` - פרטי נכס
- `GET /api/properties/search?q=...` - חיפוש נכסים

#### Investments
- `POST /api/investments` - יצירת השקעה חדשה (מוגן)
- `GET /api/investments` - רשימת השקעות של משתמש (מוגן)
- `GET /api/investments/:id` - פרטי השקעה (מוגן)

## התקנה והרצה (Installation & Running)

### דרישות מוקדמות
- Node.js 18+
- PostgreSQL 14+
- npm או yarn

### התקנה

1. **התקנת dependencies**:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

2. **הגדרת מסד נתונים**:
   - צור מסד נתונים PostgreSQL
   - העתק `backend/.env.example` ל-`backend/.env` ועדכן את פרטי החיבור
   - הרץ את ה-migration:
```bash
cd backend
psql -U postgres -d real_estate_investment -f migrations/001_initial_schema.sql
```

3. **הגדרת משתני סביבה**:
   - `backend/.env` - פרטי מסד נתונים ו-JWT secret
   - `frontend/.env.local` - URL של ה-API

### הרצה

**Development mode** (Frontend + Backend יחד):
```bash
npm run dev
```

**או בנפרד**:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

הפרויקט יעלה על:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## טכנולוגיות (Tech Stack)

### Frontend
- **Next.js 14** - React framework עם App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Data fetching & caching
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Zod** - Schema validation

## שלבים הבאים (Next Steps)

1. **UI Components** - בניית רכיבי UI (כפתורים, טופסים, כרטיסי נכסים)
2. **Authentication Pages** - דפי התחברות והרשמה
3. **Property Listing** - דף רשימת נכסים עם פילטרים
4. **Investment Flow** - תהליך השקעה מלא
5. **Dashboard** - דשבורד משתמש עם סיכום השקעות
6. **File Upload** - העלאת תמונות ומסמכים
7. **Payment Integration** - אינטגרציה עם מערכת תשלומים
8. **Email Notifications** - התראות במייל
9. **Admin Panel** - פאנל ניהול לנכסים ומשתמשים

## הערות (Notes)

- הפרויקט מוכן לקוד אמיתי - כל המבנה והטיפוסים מוגדרים
- יש להשלים את הלוגיקה העסקית הספציפית בכל service
- יש להוסיף validation מלא עם Zod
- יש להוסיף error handling מתקדם יותר
- יש להוסיף logging (Winston/Pino)
- יש להוסיף testing (Jest/Vitest)

## רישיון (License)

Private project

