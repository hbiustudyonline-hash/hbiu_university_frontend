# Base44 SDK Backend Integration Guide

## Overview
Both backends (Node.js and Python) have been updated to support the Base44 SDK used by the new Frontend. This guide explains the changes and how to use them.

## What is Base44 SDK?

Base44 SDK is a frontend framework that provides:
- **Standardized API client** with consistent patterns
- **Entity-based data management** (similar to ORM but client-side)
- **Authentication helpers**
- **Auto-routing and code generation**

## Backend Changes

### 1. Node.js Backend (Express)

#### New Routes Added

**File:** `backend/routes/entities.js`

```javascript
// Base44 SDK compatible entity routes
GET    /api/entities/:entity              // List all records
GET    /api/entities/:entity/:id          // Get single record
POST   /api/entities/:entity/filter       // Filter records with criteria
POST   /api/entities/:entity              // Create new record
PUT    /api/entities/:entity/:id          // Update record
DELETE /api/entities/:entity/:id          // Delete record
```

#### Supported Entities

Currently configured entities:
- `User` - User accounts
- `Course` - Courses
- `Enrollment` - Student enrollments
- `Assignment` - Assignments
- `College` - Colleges/departments

#### How to Add More Entities

Edit `backend/routes/entities.js`:

```javascript
const entityRegistry = {
  User,
  Course,
  Enrollment,
  Assignment,
  College,
  Module,        // Add your new model
  Quiz,          // Add your new model
  Announcement,  // Add your new model
  // ... add more as needed
};
```

#### Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-02-03T10:00:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": null,
  "timestamp": "2026-02-03T10:00:00.000Z"
}
```

### 2. Python Backend (FastAPI)

#### New Routes Added

**File:** `backend-py/main.py` (added at the end)

```python
GET    /api/entities/{entity}              # List all records
GET    /api/entities/{entity}/{entity_id}  # Get single record
POST   /api/entities/{entity}/filter       # Filter records
POST   /api/entities/{entity}              # Create new record
PUT    /api/entities/{entity}/{entity_id}  # Update record
DELETE /api/entities/{entity}/{entity_id}  # Delete record
```

#### Entity Storage

Currently uses in-memory storage (for development):

```python
entity_store = {
    "User": mock_users,
    "Course": mock_courses,
    "Enrollment": [],
    "Assignment": [],
    "College": [],
    # ... add more as needed
}
```

**Note:** For production, replace in-memory storage with database (PostgreSQL/MongoDB).

### 3. CORS Updates

Both backends now allow requests from:
- `http://localhost:5173` - Vite dev server (Base44 Frontend)
- `http://localhost:5174` - Alternative port
- `http://localhost:3000` - React dev server
- Production URLs

## Frontend Configuration

### Environment Variables

**File:** `Frontend/.env`

```env
VITE_BASE44_APP_ID=hbiu-lms
VITE_BASE44_BACKEND_URL=http://localhost:3001
```

**File:** `Frontend/.env.production`

```env
VITE_BASE44_APP_ID=hbiu-lms
VITE_BASE44_BACKEND_URL=https://hbiuuniversitybackendnode-production.up.railway.app
```

### API Client Configuration

**File:** `Frontend/src/api/base44Client.js`

```javascript
import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

export const base44 = createClient({
  appId: appParams.appId,
  serverUrl: appParams.serverUrl,
  token: appParams.token,
  functionsVersion: appParams.functionsVersion,
  requiresAuth: false
});
```

## Usage Examples

### Frontend Usage

```javascript
import { base44 } from '@/api/base44Client';

// List courses
const courses = await base44.entities.Course.list('-created_date', 10);

// Get single course
const course = await base44.entities.Course.get(courseId);

// Filter enrollments
const enrollments = await base44.entities.Enrollment.filter({ 
  student_email: user.email 
});

// Create new course
const newCourse = await base44.entities.Course.create({
  title: "Introduction to AI",
  description: "Learn AI fundamentals",
  instructor: "prof@hbiu.edu"
});

// Update course
await base44.entities.Course.update(courseId, {
  title: "Updated Title"
});

// Delete course
await base44.entities.Course.delete(courseId);

// Authentication
const currentUser = await base44.auth.me();
```

### Direct API Usage (cURL)

```bash
# List courses
curl http://localhost:3001/api/entities/Course?sort=-created_at&limit=10

# Get single course
curl http://localhost:3001/api/entities/Course/1

# Filter enrollments
curl -X POST http://localhost:3001/api/entities/Enrollment/filter \
  -H "Content-Type: application/json" \
  -d '{"student_email": "student@hbiu.edu"}'

# Create course
curl -X POST http://localhost:3001/api/entities/Course \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "New Course",
    "description": "Course description",
    "instructor": "prof@hbiu.edu"
  }'

# Update course
curl -X PUT http://localhost:3001/api/entities/Course/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "Updated Title"}'

# Delete course
curl -X DELETE http://localhost:3001/api/entities/Course/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Query Parameters

### List Endpoint

- `sort` - Field to sort by (prefix with `-` for descending)
  - Example: `sort=-created_at` (newest first)
  - Example: `sort=title` (alphabetical)
- `limit` - Maximum number of records (default: 100)
  - Example: `limit=10`

### Filter Endpoint

Send filters as JSON body:

```json
{
  "status": "active",
  "role": "student"
}
```

Query parameters:
- `sort` - Same as list endpoint
- `limit` - Same as list endpoint

## Testing

### Start Node.js Backend

```bash
cd backend
npm install
npm start
```

Server runs on: `http://localhost:3001`

### Start Python Backend

```bash
cd backend-py
pip install -r requirements.txt
python main.py
```

Server runs on: `http://localhost:8000`

### Start Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Test Endpoints

```bash
# Health check - Node.js
curl http://localhost:3001/health

# Health check - Python
curl http://localhost:8000/

# List users
curl http://localhost:3001/api/entities/User

# Get current user (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/auth/me
```

## Migration Path

### From Old API Routes

The old routes still work! New entity routes are **additive**, not replacements.

**Old routes (still working):**
- `GET /api/courses` → Still works
- `POST /api/courses` → Still works
- `GET /api/users/:id` → Still works

**New Base44 routes (newly added):**
- `GET /api/entities/Course` → New!
- `POST /api/entities/Course` → New!
- `GET /api/entities/User/:id` → New!

### Gradual Migration

You can migrate page-by-page:

1. Keep old API calls working
2. Update frontend pages to use Base44 SDK
3. Test thoroughly
4. Eventually deprecate old routes if desired

## Common Issues & Solutions

### Issue: CORS errors

**Solution:** Ensure backend CORS includes `http://localhost:5173`

Node.js (`backend/server.js`):
```javascript
origin: [
  'http://localhost:5173',
  // ... other origins
]
```

Python (`backend-py/main.py`):
```python
origins = [
    "http://localhost:5173",
    # ... other origins
]
```

### Issue: 404 on entity routes

**Solution:** Ensure entity is registered in entityRegistry

### Issue: Authentication not working

**Solution:** 
1. Check token is being sent in Authorization header
2. Verify `/api/auth/me` endpoint works
3. Ensure Base44 client is configured with correct serverUrl

### Issue: Data not persisting (Python)

**Solution:** Python backend currently uses in-memory storage. Implement database persistence:

```python
# Replace entity_store with database queries
# Example with SQLAlchemy:
from sqlalchemy.orm import Session

@app.get("/api/entities/{entity}")
async def list_entities(entity: str, db: Session = Depends(get_db)):
    model = get_model(entity)  # Your model lookup
    records = db.query(model).all()
    return {"success": True, "data": records}
```

## Next Steps

1. ✅ **Both backends updated** with Base44 entity routes
2. ✅ **CORS configured** for Vite frontend
3. ✅ **Response format standardized** across both backends
4. **TODO:** Add remaining entities (Module, Quiz, Announcement, etc.)
5. **TODO:** Add authentication middleware to entity routes
6. **TODO:** Implement database persistence in Python backend
7. **TODO:** Add validation and error handling
8. **TODO:** Add pagination support
9. **TODO:** Add search/query capabilities

## Additional Resources

- **Base44 SDK Docs:** Check `Frontend/node_modules/@base44/sdk/README.md`
- **Frontend Migration:** See `FRONTEND_MIGRATION_COMPLETE.md`
- **Backend-Frontend Alignment:** See `BACKEND_FRONTEND_ALIGNMENT.md`

## Questions?

If you encounter issues:
1. Check browser console for errors
2. Check backend logs
3. Verify environment variables are set correctly
4. Test endpoints with cURL first
5. Ensure database is running (for Node.js backend)

---

**Last Updated:** February 3, 2026
**Backends:** Node.js (Express) + Python (FastAPI)
**Frontend:** React + Vite + Base44 SDK
