# Quick Start Guide: Testing Base44 Integration

## Prerequisites

Make sure you have:
- Node.js 16+ installed
- Python 3.8+ installed  
- PostgreSQL running (for Node.js backend)
- Git bash/terminal

## Step 1: Start Node.js Backend

```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Create .env file if not exists
cat > .env << 'EOF'
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://localhost:5432/hbiu_lms
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
FRONTEND_PRODUCTION_URL=https://hbiuuniversityfrontend-production.up.railway.app
EOF

# Run database migrations/seeders
node seeders/run.js

# Start server
npm start
```

Server should start on: `http://localhost:3001`

## Step 2: Start Python Backend (Optional - for AI features)

```bash
# Navigate to Python backend
cd backend-py

# Create virtual environment (first time only)
python3 -m venv backend_env

# Activate virtual environment
source backend_env/bin/activate  # On Mac/Linux
# OR
backend_env\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << 'EOF'
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here
PORT=8000
EOF

# Start server
python main.py
```

Server should start on: `http://localhost:8000`

## Step 3: Start Frontend

```bash
# Navigate to frontend
cd Frontend

# Install dependencies (first time only)
npm install

# Verify .env file exists and is correct
cat .env

# Should show:
# VITE_BASE44_APP_ID=hbiu-lms
# VITE_BASE44_BACKEND_URL=http://localhost:3001

# Start development server
npm run dev
```

Frontend should start on: `http://localhost:5173`

## Step 4: Test the Integration

### Test 1: Login

1. Open browser to `http://localhost:5173`
2. You should see the HBIU home page
3. Click "Login" or navigate to login page
4. Use test credentials:
   - **Email:** `admin@hbiu.edu`
   - **Password:** `password123`
5. You should be logged in successfully

### Test 2: Check API Connection

Open browser console (F12) and run:

```javascript
// Test auth endpoint
fetch('http://localhost:3001/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(console.log)

// Test entities endpoint
fetch('http://localhost:3001/api/entities/Course')
.then(r => r.json())
.then(console.log)
```

### Test 3: Entity Operations

```javascript
// Import base44 in console (if available)
import { base44 } from './src/api/base44Client';

// List courses
const courses = await base44.entities.Course.list();
console.log('Courses:', courses);

// Get user info
const user = await base44.auth.me();
console.log('Current User:', user);

// Filter enrollments
const enrollments = await base44.entities.Enrollment.filter({
  status: 'active'
});
console.log('Enrollments:', enrollments);
```

## Test Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@hbiu.edu | password123 | admin |
| student@hbiu.edu | password123 | student |
| lecturer@hbiu.edu | password123 | lecturer |
| college@hbiu.edu | password123 | college_admin |

## Common Endpoints to Test

### Node.js Backend (http://localhost:3001)

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hbiu.edu","password":"password123"}'

# List courses (Base44)
curl http://localhost:3001/api/entities/Course

# List users (Base44)
curl http://localhost:3001/api/entities/User

# Filter enrollments (Base44)
curl -X POST http://localhost:3001/api/entities/Enrollment/filter \
  -H "Content-Type: application/json" \
  -d '{"status":"active"}'
```

### Python Backend (http://localhost:8000)

```bash
# Health check
curl http://localhost:8000/

# List courses
curl http://localhost:8000/api/entities/Course

# AI content generation (requires OpenAI key)
curl -X POST http://localhost:8000/api/ai/generate-content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "prompt": "Explain photosynthesis",
    "content_type": "lesson",
    "subject": "Biology",
    "difficulty": "intermediate"
  }'
```

## Troubleshooting

### Issue: CORS error

**Error:** "Access to fetch blocked by CORS policy"

**Solution:** Ensure backend is running and CORS is configured:
- Node.js: Check `backend/server.js` - should include `http://localhost:5173`
- Python: Check `backend-py/main.py` - should include `http://localhost:5173`

### Issue: 404 on /api/entities/*

**Error:** "Cannot GET /api/entities/Course"

**Solution:** 
1. Ensure backend is running
2. Check `backend/server.js` includes: `app.use('/api/entities', require('./routes/entities'));`
3. Restart backend server

### Issue: Database connection failed

**Error:** "Unable to connect to the database"

**Solution:**
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Create database: `createdb hbiu_lms`
4. Run migrations: `node seeders/run.js`

### Issue: Frontend can't connect

**Error:** "Failed to fetch" or network errors

**Solution:**
1. Check backend is running on correct port (3001 for Node, 8000 for Python)
2. Verify `Frontend/.env` has correct `VITE_BASE44_BACKEND_URL`
3. Clear browser cache and reload
4. Check browser console for specific errors

### Issue: Login fails

**Error:** "Invalid credentials" or "User not found"

**Solution:**
1. Ensure database is seeded: `cd backend && node seeders/run.js`
2. Check test users exist in database
3. Verify password is correct: `password123`
4. Check backend logs for errors

## Next Steps

Once everything is working:

1. ✅ Test creating new courses via frontend
2. ✅ Test enrolling students
3. ✅ Test creating assignments
4. ✅ Test submitting assignments
5. ✅ Test grading
6. ✅ Explore all 67+ pages in the frontend
7. 📝 Customize entities to match your needs
8. 🚀 Deploy to production

## Production Deployment

When ready to deploy:

1. Update `Frontend/.env.production`:
   ```env
   VITE_BASE44_APP_ID=hbiu-lms
   VITE_BASE44_BACKEND_URL=https://your-backend.railway.app
   ```

2. Build frontend:
   ```bash
   cd Frontend
   npm run build
   ```

3. Deploy `dist/` folder to your hosting service

4. Update backend CORS to include production frontend URL

## Need Help?

Check these files:
- `BASE44_INTEGRATION_GUIDE.md` - Comprehensive integration guide
- `BACKEND_FRONTEND_ALIGNMENT.md` - API alignment details
- `FRONTEND_MIGRATION_COMPLETE.md` - Frontend migration info

---

**Last Updated:** February 3, 2026  
**Status:** ✅ Both backends updated and ready
