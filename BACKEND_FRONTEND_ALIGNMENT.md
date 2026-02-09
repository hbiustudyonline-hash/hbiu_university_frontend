# Backend-Frontend Alignment Documentation

This document outlines the alignment between the Node.js Express backend and the React frontend for the HBIU LMS.

## ✅ API Response Format

### Backend Response Structure
The backend uses a consistent response format via `utils/response.js`:

```javascript
// Success Response
{
  success: true,
  message: "Operation successful",
  data: { ... },
  timestamp: "2025-01-27T10:00:00.000Z"
}

// Error Response
{
  success: false,
  message: "Error description",
  errors: null,
  timestamp: "2025-01-27T10:00:00.000Z"
}
```

### Frontend Compatibility
The frontend API client (`Frontend/src/api/base44Client.js`) expects:
- `success` flag to determine operation success
- `data` object containing the response payload
- Compatible with backend format ✅

## ✅ Authentication System

### Login Endpoint
**Backend:** `POST /api/auth/login`
```javascript
// Request
{ email, password }

// Response
{
  success: true,
  data: {
    token: "jwt-token-here",
    user: {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@hbiu.edu",
      role: "student",
      status: "active",
      // ... other fields
    }
  }
}
```

**Frontend:** Matches backend format ✅

### User Field Naming Convention
- **Backend User Model:** Uses `firstName`, `lastName` (camelCase)
- **Frontend Display:** Uses `user?.firstName`, `user?.lastName` (camelCase)
- **Status:** ✅ Aligned

### User Roles
Both backend and frontend support:
- `admin` - System administrator
- `student` - Student user
- `lecturer` - Teaching staff
- `college_admin` - College administration

## ✅ Test Users

The following test users are available in both mock mode and seeded backend:

| Email | Password | Role | ID |
|-------|----------|------|-----|
| admin@hbiu.edu | password123 | admin | 1 |
| student@hbiu.edu | password123 | student | 2 |
| lecturer@hbiu.edu | password123 | lecturer | 3 |
| college@hbiu.edu | password123 | college_admin | 4 |

### Backend Seeding
Run the seeder to populate the database:
```bash
cd backend
node seeders/run.js
```

This creates:
- 4 colleges
- 13 users (including the 4 test users above)
- 5 courses
- 7 enrollments
- 5 assignments

## 📋 User Model Fields

### Backend (Sequelize Model)
```javascript
{
  id: INTEGER (Primary Key),
  firstName: STRING (camelCase),
  lastName: STRING (camelCase),
  email: STRING (unique),
  password: STRING (hashed),
  role: ENUM ['student', 'lecturer', 'admin', 'college_admin'],
  status: ENUM ['active', 'inactive', 'suspended'],
  studentId: STRING (nullable, for students),
  phoneNumber: STRING (nullable),
  dateOfBirth: DATE (nullable),
  emailVerified: BOOLEAN,
  lastLogin: DATE (nullable),
  collegeId: INTEGER (Foreign Key),
  createdAt: DATE,
  updatedAt: DATE
}
```

### Frontend Usage
The frontend stores the user object as-is from the API response in:
- `AuthContext` state
- `localStorage` as `userData`

Display components access fields as:
```jsx
{user?.firstName} {user?.lastName}
{user?.email}
{user?.role}
```

## 🔄 Mock Mode vs Real Backend

### Current Status
Frontend is running in **MOCK_MODE** for development without backend dependency.

### Switching to Real Backend

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm start
   ```
   Server runs on `http://localhost:3001`

2. **Disable Mock Mode:**
   In `Frontend/src/api/base44Client.js`:
   ```javascript
   const MOCK_MODE = false; // Change from true to false
   ```

3. **Verify Connection:**
   - Login with test users
   - Backend should respond with seeded data
   - Check browser console for API calls

## 🚀 Next Steps for Backend Integration

### Required Backend Endpoints

The frontend expects these endpoints to be fully implemented:

#### ✅ Authentication (Already Implemented)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/change-password` - Change password
- `PUT /api/auth/profile` - Update profile

#### 🔄 Courses (Partially Implemented)
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/:id/modules` - Get course modules
- `GET /api/courses/:id/assignments` - Get course assignments
- `GET /api/courses/:id/students` - Get enrolled students

#### 🔄 Users (Partially Implemented)
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id/courses` - Get user's courses
- `GET /api/users/:id/stats` - Get user statistics

#### ⏳ Admin (Needs Implementation)
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - Admin user management
- `GET /api/admin/analytics` - Analytics data
- `PUT /api/admin/users/:id/role` - Update user role
- `POST /api/admin/bulk-operations` - Bulk operations
- `GET /api/admin/system-health` - System health check

#### ⏳ Colleges (Needs Full Implementation)
- `GET /api/colleges` - List colleges
- `GET /api/colleges/:id` - Get college details
- `POST /api/colleges` - Create college
- `PUT /api/colleges/:id` - Update college
- `DELETE /api/colleges/:id` - Delete college
- `GET /api/colleges/:id/courses` - College courses
- `GET /api/colleges/:id/staff` - College staff
- `GET /api/colleges/:id/students` - College students

#### ⏳ Enrollments (Needs Implementation)
- `GET /api/enrollments` - List enrollments
- Query parameters: `ordering`, `student`, `course`

#### ⏳ Assignments (Needs Implementation)
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment
- `PATCH /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment
- Query parameters: `ordering`, `limit`

#### ⏳ Announcements (Needs Implementation)
- `GET /api/announcements` - List announcements
- `POST /api/announcements` - Create announcement
- `PATCH /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

#### ⏳ Additional Entities (Needs Implementation)
- Submissions
- Grades
- Course Files
- Live Classes
- Student Profiles
- Transcripts
- Quizzes (Questions, Choices, Submissions, Answers)
- Pages
- Discussions
- Attendance
- Modules

## 🔐 Authentication Flow

1. **Login Request:** Frontend sends email/password to `/api/auth/login`
2. **Backend Validation:** Backend verifies credentials, checks user status
3. **Token Generation:** Backend generates JWT token with user ID
4. **Response:** Backend returns user object (without password) and token
5. **Frontend Storage:** Frontend stores token in localStorage and user in AuthContext
6. **Protected Routes:** Frontend includes token in Authorization header for subsequent requests
7. **Token Verification:** Backend middleware validates token for protected routes

## 📊 Dashboard Data Requirements

### Student Dashboard (`/Dashboard`)
Needs:
- Enrolled courses with progress
- Upcoming assignments
- Recent announcements
- GPA and credits information

### Lecturer Dashboard (`/LecturerDashboard`)
Needs:
- Courses taught
- Student submissions
- Class schedule
- Course statistics

### Admin Dashboard (`/AdminDashboard`)
Needs:
- System statistics (users, courses, colleges)
- Recent activity
- User management capabilities
- System health metrics

### College Admin Dashboard (`/EnrollmentDashboard`)
Needs:
- Pending applications
- Enrollment statistics
- Program capacity
- Student management

## 🐛 Known Issues & Solutions

### Issue: Node.js PATH Problems
**Symptom:** Backend server won't start due to Node.js not found
**Solution:** 
```bash
# Add to ~/.zshrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Reload shell
source ~/.zshrc

# Verify
which node
node --version
```

### Issue: Database Connection
**Symptom:** Sequelize connection errors
**Solution:**
1. Verify database configuration in `backend/config/database.js`
2. Ensure database exists
3. Run migrations if needed
4. Check database credentials

### Issue: CORS Errors
**Symptom:** Frontend can't connect to backend API
**Solution:** Backend already configured with CORS in `server.js`
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
```

## 📝 Testing Checklist

Before switching from mock mode to real backend:

- [ ] Backend server starts successfully
- [ ] Database is seeded with test data
- [ ] Login with test users works
- [ ] User data displays correctly (firstName, lastName)
- [ ] Role-based redirects work correctly
- [ ] Protected routes require authentication
- [ ] Token is included in API requests
- [ ] Logout clears token and redirects

## 🎯 Summary

**Current Status:**
- ✅ API response formats aligned
- ✅ User model fields aligned (camelCase)
- ✅ Authentication system compatible
- ✅ Test users available in both systems
- ✅ Frontend working in mock mode
- 🔄 Backend needs additional endpoint implementations

**Next Priority:**
1. Resolve Node.js PATH issues to start backend
2. Run database seeder
3. Test authentication flow end-to-end
4. Implement missing backend endpoints as needed by frontend
5. Switch frontend from mock mode to real backend
