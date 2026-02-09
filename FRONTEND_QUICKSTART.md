# Quick Start Guide - New Frontend

## 🚀 Start Development Server

```bash
cd Frontend
npm run dev
```

Then open: http://localhost:5173

## 🔑 Environment Setup

The Frontend is pre-configured to connect to your backend:
- **Dev:** http://localhost:3001
- **Prod:** https://hbiuuniversitybackendnode-production.up.railway.app

To change these, edit `Frontend/.env`

## 📁 Key Directory Structure

```
Frontend/
├── src/
│   ├── pages/                 # 67+ page components
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── LecturerDashboard.jsx
│   │   ├── StudentProfile.jsx
│   │   ├── HRManagement.jsx   # NEW
│   │   ├── Analytics*.jsx     # NEW
│   │   └── ... (60+ more)
│   │
│   ├── components/            # Organized by feature
│   │   ├── analytics/        # NEW - Analytics components
│   │   ├── gamification/     # NEW - Points, badges, leaderboards
│   │   ├── collaboration/    # NEW - Group work, peer review
│   │   ├── hr/               # NEW - HR management
│   │   ├── community/        # NEW - Community features
│   │   ├── language/         # NEW - Multi-language support
│   │   ├── admin/
│   │   ├── student/
│   │   ├── lecturer/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── AuthContext.jsx         # Enhanced auth
│   │   ├── NavigationTracker.jsx   # NEW
│   │   ├── VisualEditAgent.jsx     # NEW
│   │   └── app-params.js           # Environment config
│   │
│   ├── api/
│   │   └── base44Client.js    # API client (Base44 SDK)
│   │
│   └── pages.config.js        # Auto-routing configuration
│
├── functions/                 # 18 Azure Functions (TypeScript)
├── .env                      # Development environment
└── .env.production          # Production environment
```

## 🎯 Key Pages by Role

### Admin Pages
- `/AdminDashboard` - Main admin dashboard
- `/VirtualAdminOffice` - Admin office hub
- `/AdminStudentIDViewer` - View student IDs
- `/BulkEnrollment` - Bulk student enrollment
- `/SystemSettings` - System configuration
- `/ReportingDashboard` - Reports and analytics
- `/HRManagement` - HR system (NEW)
- `/EmployeeDirectory` - Staff directory (NEW)

### Lecturer Pages
- `/LecturerDashboard` - Main lecturer dashboard
- `/LecturerCourseSelection` - Course management
- `/LecturerPerformanceDashboard` - Performance metrics (NEW)
- `/SubmissionManagement` - Grade submissions (NEW)

### Student Pages
- `/Dashboard` - Student dashboard
- `/StudentProfile` - Profile management
- `/Courses` - Browse courses
- `/HighPerformersBoard` - Leaderboard (NEW)

### Shared Pages
- `/Courses` - Course catalog
- `/CourseDetail` - Course details
- `/Colleges` - College list
- `/NotificationCenter` - Notifications (NEW)
- `/CommunityGroup` - Community features (NEW)

## 🔧 Common Tasks

### Add a New Page
1. Create file in `src/pages/MyNewPage.jsx`
2. Run the app - it auto-registers in `pages.config.js`
3. Access at `/MyNewPage`

### Modify API Endpoint
Edit `src/api/base44Client.js` or `src/lib/app-params.js`

### Change Theme/Styling
Edit `src/index.css` or `tailwind.config.js`

### Add New Component
Create in appropriate subfolder under `src/components/`

## 🧪 Testing

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🆘 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Authentication issues
1. Check `.env` file exists
2. Verify `VITE_BASE44_BACKEND_URL` is correct
3. Ensure backend is running

### Page not loading
1. Check `src/pages.config.js` includes the page
2. Restart dev server (`npm run dev`)

### Build fails
1. Run `npm run lint` to find syntax errors
2. Check for missing dependencies: `npm install`

## 📝 Development Workflow

1. **Start backend first:**
   ```bash
   cd backend
   npm start
   ```

2. **Start frontend:**
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Make changes** - hot reload works automatically

4. **Test changes** in browser

5. **Commit when ready:**
   ```bash
   git add .
   git commit -m "your message"
   git push
   ```

## 🎨 New Features to Explore

1. **Analytics Dashboard** - `/ReportingDashboard`
2. **Gamification** - Check any student page for points/badges
3. **HR System** - `/HRManagement`
4. **Community** - `/CommunityGroup`
5. **Multi-language** - Language selector in nav
6. **AI Features** - Throughout course management

## 📚 More Info

- Full migration details: `FRONTEND_MIGRATION_COMPLETE.md`
- Backend docs: `backend/README.md`
- Old Frontend backup: `Frontend-old/`
