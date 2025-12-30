# Project Structure (מבנה הפרויקט)

## Complete Folder Tree

```
real-estate-investment-platform/
│
├── 📄 package.json                    # Root package.json (monorepo scripts)
├── 📄 .gitignore                     # Git ignore rules
├── 📄 README.md                      # Main documentation (Hebrew)
├── 📄 ARCHITECTURE.md                # Architecture documentation (Hebrew)
├── 📄 QUICKSTART.md                  # Quick start guide (Hebrew)
│
├── 📁 frontend/                       # Next.js Frontend Application
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json              # TypeScript configuration
│   ├── 📄 next.config.js             # Next.js configuration
│   ├── 📄 tailwind.config.js         # Tailwind CSS configuration
│   ├── 📄 postcss.config.js          # PostCSS configuration
│   ├── 📄 env.example                # Environment variables template
│   │
│   └── 📁 src/
│       ├── 📁 app/                   # Next.js App Router
│       │   ├── 📄 layout.tsx        # Root layout
│       │   ├── 📄 page.tsx          # Home page
│       │   └── 📄 globals.css        # Global styles
│       │
│       ├── 📁 components/            # React Components
│       │   └── 📄 README.md         # Components documentation
│       │
│       ├── 📁 lib/                   # Utilities & Libraries
│       │   └── 📁 api/
│       │       ├── 📄 client.ts     # Axios API client
│       │       └── 📄 endpoints.ts  # API endpoint definitions
│       │
│       ├── 📁 types/                 # TypeScript Type Definitions
│       │   ├── 📄 domains.ts        # Domain types (User, Property, Investment)
│       │   └── 📄 api.ts            # API request/response types
│       │
│       └── 📁 store/                 # State Management (Zustand)
│           └── 📄 authStore.ts      # Authentication store
│
└── 📁 backend/                        # Node.js Backend API
    ├── 📄 package.json
    ├── 📄 tsconfig.json              # TypeScript configuration
    ├── 📄 .eslintrc.json             # ESLint configuration
    ├── 📄 env.example                # Environment variables template
    │
    ├── 📁 migrations/                # Database Migrations
    │   └── 📄 001_initial_schema.sql # Initial database schema
    │
    └── 📁 src/
        ├── 📄 server.ts              # Express server entry point
        │
        ├── 📁 domains/                # Domain-Driven Design Structure
        │   │
        │   ├── 📁 users/             # Users Domain
        │   │   ├── 📁 models/
        │   │   │   └── 📄 userModel.ts      # User database operations
        │   │   ├── 📁 services/
        │   │   │   ├── 📄 authService.ts    # Authentication logic
        │   │   │   └── 📄 userService.ts    # User profile logic
        │   │   └── 📁 routes/
        │   │       ├── 📄 authRoutes.ts     # Auth API endpoints
        │   │       └── 📄 userRoutes.ts     # User API endpoints
        │   │
        │   ├── 📁 properties/        # Properties Domain
        │   │   ├── 📁 models/
        │   │   │   └── 📄 propertyModel.ts  # Property database operations
        │   │   ├── 📁 services/
        │   │   │   └── 📄 propertyService.ts # Property business logic
        │   │   └── 📁 routes/
        │   │       └── 📄 propertyRoutes.ts  # Property API endpoints
        │   │
        │   └── 📁 investments/       # Investments Domain
        │       ├── 📁 models/
        │       │   └── 📄 investmentModel.ts    # Investment database operations
        │       ├── 📁 services/
        │       │   └── 📄 investmentService.ts  # Investment business logic
        │       └── 📁 routes/
        │           └── 📄 investmentRoutes.ts   # Investment API endpoints
        │
        └── 📁 shared/                # Shared Utilities
            ├── 📁 database/
            │   └── 📄 connection.ts  # PostgreSQL connection pool
            ├── 📁 middleware/
            │   ├── 📄 auth.ts        # JWT authentication middleware
            │   └── 📄 errorHandler.ts # Error handling middleware
            ├── 📁 types/
            │   └── 📄 domains.ts     # Shared domain types
            └── 📁 utils/
                └── 📄 validation.ts  # Zod validation schemas
```

## Key Files Explained

### Frontend Key Files

| File | Purpose |
|------|---------|
| `frontend/src/app/layout.tsx` | Root layout for all pages |
| `frontend/src/app/page.tsx` | Home page component |
| `frontend/src/types/domains.ts` | TypeScript types for all domains |
| `frontend/src/lib/api/client.ts` | Axios client with auth interceptors |
| `frontend/src/lib/api/endpoints.ts` | All API endpoint functions |
| `frontend/src/store/authStore.ts` | Authentication state management |

### Backend Key Files

| File | Purpose |
|------|---------|
| `backend/src/server.ts` | Express server setup and route registration |
| `backend/src/shared/database/connection.ts` | PostgreSQL connection pool |
| `backend/src/shared/middleware/auth.ts` | JWT authentication middleware |
| `backend/src/shared/middleware/errorHandler.ts` | Global error handler |
| `backend/migrations/001_initial_schema.sql` | Database schema (tables, indexes) |

### Domain Structure Pattern

Each domain follows this pattern:
```
domain-name/
├── models/        # Database access layer
├── services/      # Business logic layer
└── routes/        # API endpoints layer
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `apiClient.ts`)
- **Types**: camelCase (e.g., `domains.ts`)
- **Routes**: camelCase with "Routes" suffix (e.g., `authRoutes.ts`)
- **Services**: camelCase with "Service" suffix (e.g., `authService.ts`)
- **Models**: camelCase with "Model" suffix (e.g., `userModel.ts`)

## Import Paths

### Frontend
- `@/components/*` → `frontend/src/components/*`
- `@/lib/*` → `frontend/src/lib/*`
- `@/types/*` → `frontend/src/types/*`
- `@/store/*` → `frontend/src/store/*`

### Backend
- `@/*` → `backend/src/*`
- `@/domains/*` → `backend/src/domains/*`
- `@/shared/*` → `backend/src/shared/*`

## Database Tables

1. **users** - User accounts and profiles
2. **properties** - Real estate properties
3. **investments** - User investments in properties
4. **documents** - Property-related documents

## API Routes Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── POST /refresh
│
├── /users
│   ├── GET /me
│   └── PUT /me
│
├── /properties
│   ├── GET /
│   └── GET /:id
│
└── /investments
    ├── POST /
    ├── GET /
    └── GET /:id
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3001)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Next Steps for Development

1. **Add UI Components** in `frontend/src/components/`
2. **Create Pages** in `frontend/src/app/`
3. **Implement Business Logic** in `backend/src/domains/*/services/`
4. **Add Validation** using Zod schemas
5. **Add Error Handling** for edge cases
6. **Add Tests** for services and components
7. **Add Logging** for debugging and monitoring

