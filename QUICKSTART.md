# Quick Start Guide (מדריך התחלה מהירה)

## שלב 1: התקנת Dependencies

```bash
# התקנת dependencies ברמה הראשית
npm install

# התקנת dependencies ל-Frontend
cd frontend
npm install

# התקנת dependencies ל-Backend
cd ../backend
npm install
```

## שלב 2: הגדרת מסד נתונים

1. **צור מסד נתונים PostgreSQL**:
```sql
CREATE DATABASE real_estate_investment;
```

2. **הרץ את ה-Migration**:
```bash
cd backend
psql -U postgres -d real_estate_investment -f migrations/001_initial_schema.sql
```

או דרך psql:
```bash
psql -U postgres
\c real_estate_investment
\i migrations/001_initial_schema.sql
```

## שלב 3: הגדרת משתני סביבה

### Backend
צור קובץ `backend/.env` מהתבנית:
```bash
cd backend
cp env.example .env
```

עדכן את הערכים ב-`.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=real_estate_investment
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-key-change-this
```

### Frontend
צור קובץ `frontend/.env.local`:
```bash
cd frontend
cp env.example .env.local
```

עדכן את ה-URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## שלב 4: הרצת הפרויקט

### אופציה 1: הרצה משולבת (מומלץ)
```bash
# מהתיקייה הראשית
npm run dev
```

זה יריץ את Frontend (port 3000) ו-Backend (port 3001) יחד.

### אופציה 2: הרצה נפרדת

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

## שלב 5: בדיקת הפרויקט

1. **בדוק את ה-Backend**:
   - פתח: http://localhost:3001/health
   - אמור לראות: `{"status":"ok","timestamp":"..."}`

2. **בדוק את ה-Frontend**:
   - פתח: http://localhost:3000
   - אמור לראות את דף הבית

## שלב 6: יצירת משתמש ראשון (דוגמה)

```bash
# דרך API (Postman/curl)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## Troubleshooting (פתרון בעיות)

### שגיאת חיבור למסד נתונים
- ודא ש-PostgreSQL רץ
- בדוק את פרטי החיבור ב-`backend/.env`
- ודא שהמסד נתונים קיים

### שגיאת Port כבר בשימוש
- שנה את ה-PORT ב-`backend/.env`
- או עצור את התהליך שמשתמש ב-port

### שגיאת TypeScript
```bash
# בדוק types
npm run type-check
```

### שגיאת Dependencies
```bash
# נקה node_modules והתקן מחדש
rm -rf node_modules package-lock.json
npm install
```

## Next Steps (השלבים הבאים)

1. ✅ הפרויקט מוכן לקוד אמיתי
2. 📝 התחל לבנות UI Components
3. 🔐 הוסף דפי Authentication
4. 🏠 בנה דף רשימת נכסים
5. 💰 הוסף תהליך השקעה
6. 📊 בנה Dashboard למשתמש

## Useful Commands (פקודות שימושיות)

```bash
# Development
npm run dev              # Run both frontend & backend
npm run dev:frontend     # Run frontend only
npm run dev:backend      # Run backend only

# Build
npm run build            # Build both
npm run build:frontend   # Build frontend
npm run build:backend    # Build backend

# Linting
npm run lint             # Lint both
npm run lint:frontend    # Lint frontend
npm run lint:backend    # Lint backend

# Type checking
npm run type-check       # Check types in both
```

