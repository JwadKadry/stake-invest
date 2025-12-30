# Architecture Documentation (תיעוד ארכיטקטורה)

## סקירה כללית (Overview)

הפרויקט בנוי על עקרונות של **Domain-Driven Design (DDD)** ו-**Clean Architecture**, עם הפרדה ברורה בין שכבות.

## מבנה שכבות (Layer Structure)

### Frontend Layers

```
┌─────────────────────────────────────┐
│   Presentation Layer (UI)          │
│   - Components, Pages, Layouts     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   State Management Layer            │
│   - Zustand Stores, React Query     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   API Layer                          │
│   - API Client, Endpoints            │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   Types Layer                        │
│   - Domain Types, API Types          │
└─────────────────────────────────────┘
```

### Backend Layers

```
┌─────────────────────────────────────┐
│   Routes Layer (API Endpoints)       │
│   - Express Routes, Request Handling │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   Service Layer (Business Logic)     │
│   - Domain Services, Validation      │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   Model Layer (Data Access)          │
│   - Database Queries, Data Mapping   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   Database Layer                     │
│   - PostgreSQL, Migrations           │
└─────────────────────────────────────┘
```

## Domain Structure (מבנה דומיינים)

### Users Domain

**Responsibility**: ניהול משתמשים ואימות

**Flow**:
1. User registers → `authRoutes` → `AuthService.register()` → `UserModel.create()`
2. User logs in → `authRoutes` → `AuthService.login()` → JWT token
3. Protected route → `authenticate` middleware → validates JWT → `req.userId`

**Key Files**:
- `backend/src/domains/users/models/userModel.ts` - CRUD operations
- `backend/src/domains/users/services/authService.ts` - Authentication logic
- `backend/src/domains/users/services/userService.ts` - User profile logic
- `backend/src/shared/middleware/auth.ts` - JWT validation

### Properties Domain

**Responsibility**: ניהול נכסי נדל"ן

**Flow**:
1. List properties → `propertyRoutes` → `PropertyService.getAll()` → `PropertyModel.findAll()`
2. Get property → `propertyRoutes` → `PropertyService.getById()` → `PropertyModel.findById()`

**Key Files**:
- `backend/src/domains/properties/models/propertyModel.ts` - Property queries
- `backend/src/domains/properties/services/propertyService.ts` - Business logic
- `backend/src/domains/properties/routes/propertyRoutes.ts` - API endpoints

### Investments Domain

**Responsibility**: ניהול השקעות

**Flow**:
1. Create investment → `investmentRoutes` → `InvestmentService.create()` → 
   - Validates property availability
   - Creates investment record
   - Updates property available shares
2. Get user investments → `investmentRoutes` → `InvestmentService.getByUserId()` → joins with properties

**Key Files**:
- `backend/src/domains/investments/models/investmentModel.ts` - Investment queries
- `backend/src/domains/investments/services/investmentService.ts` - Investment logic
- `backend/src/domains/investments/routes/investmentRoutes.ts` - API endpoints

## Data Flow (זרימת נתונים)

### Example: Creating an Investment

```
Frontend:
  User clicks "Invest" 
  → investmentApi.create({ propertyId, shares })
  → POST /api/investments
  → axios with JWT token

Backend:
  Request arrives
  → authenticate middleware (validates JWT)
  → investmentRoutes.post('/')
  → InvestmentService.create()
    → PropertyModel.findById() (validate property exists)
    → Validate shares available
    → InvestmentModel.create() (create investment)
    → Update property.available_shares
  → Return investment with property data

Frontend:
  Response received
  → Update Zustand store
  → React Query cache update
  → UI re-renders
```

## Security Architecture (אבטחה)

### Authentication Flow

1. **Registration/Login**:
   - User provides credentials
   - Password hashed with bcrypt (10 rounds)
   - JWT token generated (7 days expiry)
   - Token stored in localStorage (Frontend)

2. **Protected Routes**:
   - Request includes `Authorization: Bearer <token>`
   - `authenticate` middleware validates token
   - Extracts `userId` and `email` from token
   - Adds to `req.user` and `req.userId`

3. **Token Refresh**:
   - TODO: Implement refresh token mechanism
   - Currently: Simple token validation

### Password Security
- bcrypt hashing (10 salt rounds)
- Never return password_hash in API responses
- `sanitizeUser()` removes sensitive data

## Database Design (עיצוב מסד נתונים)

### Relationships

```
users (1) ──→ (N) investments
properties (1) ──→ (N) investments
properties (1) ──→ (N) documents
```

### Indexes
- `users.email` - Unique index for fast login lookup
- `properties.status` - For filtering active properties
- `investments.user_id` - For user investment queries
- `investments.property_id` - For property investment queries

### Constraints
- Foreign keys with CASCADE delete
- CHECK constraints for enums (status, type)
- NOT NULL constraints on required fields

## Error Handling (טיפול בשגיאות)

### Backend Error Flow

```
Service throws error
  → createError(message, statusCode)
  → errorHandler middleware catches
  → Returns JSON: { success: false, error: message }
```

### Frontend Error Handling

```
API call fails
  → axios interceptor catches
  → 401 → Clear token, redirect to login
  → Other errors → Display error message
```

## State Management (ניהול מצב)

### Frontend State

1. **Zustand Stores**:
   - `authStore` - Authentication state (user, token)
   - Future: `propertyStore`, `investmentStore`

2. **React Query**:
   - Server state caching
   - Automatic refetching
   - Optimistic updates

### Backend State
- Stateless (JWT tokens)
- Database as single source of truth

## API Design (עיצוב API)

### Response Format

**Success**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Error**:
```json
{
  "success": false,
  "error": "Error message"
}
```

**Paginated**:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### HTTP Methods
- `GET` - Read operations
- `POST` - Create operations
- `PUT` - Update operations
- `DELETE` - Delete operations (future)

## Scalability Considerations (שיקולי מדרגיות)

### Current Architecture Supports:

1. **Horizontal Scaling**:
   - Stateless backend (JWT tokens)
   - Database connection pooling
   - Can run multiple backend instances

2. **Database Scaling**:
   - Indexes on frequently queried fields
   - Foreign key constraints for data integrity
   - Ready for read replicas

3. **Frontend Scaling**:
   - Component-based architecture
   - Code splitting with Next.js
   - Static asset optimization

### Future Enhancements:

1. **Caching**:
   - Redis for session management
   - CDN for static assets
   - API response caching

2. **Message Queue**:
   - RabbitMQ/Kafka for async operations
   - Email notifications
   - Investment processing

3. **Microservices**:
   - Split domains into separate services
   - API Gateway pattern
   - Service mesh

## Testing Strategy (אסטרטגיית בדיקות)

### Unit Tests
- Services: Business logic validation
- Models: Database query correctness
- Utilities: Helper functions

### Integration Tests
- API endpoints: Full request/response flow
- Database: Migration and data integrity

### E2E Tests
- User flows: Registration → Investment
- Critical paths: Authentication, Investment creation

## Deployment (פריסה)

### Recommended Setup:

1. **Frontend**: Vercel/Netlify
   - Automatic deployments
   - Edge network
   - Next.js optimized

2. **Backend**: AWS/DigitalOcean/Heroku
   - Node.js runtime
   - PostgreSQL managed service
   - Environment variables

3. **Database**: Managed PostgreSQL
   - Automatic backups
   - High availability
   - Monitoring

## Monitoring & Logging (ניטור ולוגים)

### Recommended Tools:

1. **Application Monitoring**:
   - Sentry (error tracking)
   - DataDog/New Relic (performance)

2. **Logging**:
   - Winston/Pino (structured logs)
   - CloudWatch/Loggly (log aggregation)

3. **Analytics**:
   - Google Analytics (user behavior)
   - Custom events (investment tracking)

