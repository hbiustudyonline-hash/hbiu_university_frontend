/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import ActiveCourseManagement from './pages/ActiveCourseManagement';
import AdditionalProgramOutlines from './pages/AdditionalProgramOutlines';
import AdminAddLecturer from './pages/AdminAddLecturer';
import AdminDashboard from './pages/AdminDashboard';
import AdminOfficeTutorial from './pages/AdminOfficeTutorial';
import AdminStudentIDViewer from './pages/AdminStudentIDViewer';
import AuditLogViewer from './pages/AuditLogViewer';
import BulkEnrollment from './pages/BulkEnrollment';
import BulkProgramCourseCreator from './pages/BulkProgramCourseCreator';
import BulkSemesterLabelUpdater from './pages/BulkSemesterLabelUpdater';
import BulkStudentCollegeFix from './pages/BulkStudentCollegeFix';
import CalendarScheduling from './pages/CalendarScheduling';
import CollegeAdminDashboard from './pages/CollegeAdminDashboard';
import CollegeConnect from './pages/CollegeConnect';
import CollegeDetail from './pages/CollegeDetail';
import CollegePasswordManager from './pages/CollegePasswordManager';
import Colleges from './pages/Colleges';
import CommunityGroup from './pages/CommunityGroup';
import CourseDetail from './pages/CourseDetail';
import CourseExam from './pages/CourseExam';
import CourseOralExam from './pages/CourseOralExam';
import CourseSchedulingSystem from './pages/CourseSchedulingSystem';
import Courses from './pages/Courses';
import CoursesWithoutImages from './pages/CoursesWithoutImages';
import Dashboard from './pages/Dashboard';
import DegreeProgramManagement from './pages/DegreeProgramManagement';
import DocumentCenter from './pages/DocumentCenter';
import EmployeeDirectory from './pages/EmployeeDirectory';
import EnrollmentDashboard from './pages/EnrollmentDashboard';
import GlobalSubmissionViewer from './pages/GlobalSubmissionViewer';
import HRManagement from './pages/HRManagement';
import HelpDeskSystem from './pages/HelpDeskSystem';
import HighPerformersBoard from './pages/HighPerformersBoard';
import Home from './pages/Home';
import InternalMessages from './pages/InternalMessages';
import LeaveManagement from './pages/LeaveManagement';
import LecturerCourseSelection from './pages/LecturerCourseSelection';
import LecturerDashboard from './pages/LecturerDashboard';
import LecturerIDManagement from './pages/LecturerIDManagement';
import LecturerPerformanceDashboard from './pages/LecturerPerformanceDashboard';
import LecturerProfilePage from './pages/LecturerProfilePage';
import LecturerRegistrationPublic from './pages/LecturerRegistrationPublic';
import LecturerTutorial from './pages/LecturerTutorial';
import NotificationCenter from './pages/NotificationCenter';
import NotificationPreferences from './pages/NotificationPreferences';
import Notifications from './pages/Notifications';
import OnboardingManagement from './pages/OnboardingManagement';
import PayrollManagement from './pages/PayrollManagement';
import PerformanceReviewSystem from './pages/PerformanceReviewSystem';
import Programs from './pages/Programs';
import ProgramsCatalog from './pages/ProgramsCatalog';
import ReceptionDashboard from './pages/ReceptionDashboard';
import ReconstructTransferHistory from './pages/ReconstructTransferHistory';
import ReportingDashboard from './pages/ReportingDashboard';
import StaffApplicationPortal from './pages/StaffApplicationPortal';
import StaffApplicationReview from './pages/StaffApplicationReview';
import StaffOnboarding from './pages/StaffOnboarding';
import StaffSupport from './pages/StaffSupport';
import StudentProfile from './pages/StudentProfile';
import StudentProfilePage from './pages/StudentProfilePage';
import StudentSupport from './pages/StudentSupport';
import StudentTutorial from './pages/StudentTutorial';
import StudentsNeedingHelp from './pages/StudentsNeedingHelp';
import SubmissionManagement from './pages/SubmissionManagement';
import SystemSettings from './pages/SystemSettings';
import TestTranscriptGenerator from './pages/TestTranscriptGenerator';
import UniversityAnnouncements from './pages/UniversityAnnouncements';
import VirtualAdminOffice from './pages/VirtualAdminOffice';
import courseDetail from './pages/course-detail';
import PublicCourseDetail from './pages/PublicCourseDetail';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "ActiveCourseManagement": ActiveCourseManagement,
    "AdditionalProgramOutlines": AdditionalProgramOutlines,
    "AdminAddLecturer": AdminAddLecturer,
    "AdminDashboard": AdminDashboard,
    "AdminOfficeTutorial": AdminOfficeTutorial,
    "AdminStudentIDViewer": AdminStudentIDViewer,
    "AuditLogViewer": AuditLogViewer,
    "BulkEnrollment": BulkEnrollment,
    "BulkProgramCourseCreator": BulkProgramCourseCreator,
    "BulkSemesterLabelUpdater": BulkSemesterLabelUpdater,
    "BulkStudentCollegeFix": BulkStudentCollegeFix,
    "CalendarScheduling": CalendarScheduling,
    "CollegeAdminDashboard": CollegeAdminDashboard,
    "CollegeConnect": CollegeConnect,
    "CollegeDetail": CollegeDetail,
    "CollegePasswordManager": CollegePasswordManager,
    "Colleges": Colleges,
    "CommunityGroup": CommunityGroup,
    "CourseDetail": CourseDetail,
    "CourseExam": CourseExam,
    "CourseOralExam": CourseOralExam,
    "CourseSchedulingSystem": CourseSchedulingSystem,
    "Courses": Courses,
    "CoursesWithoutImages": CoursesWithoutImages,
    "Dashboard": Dashboard,
    "DegreeProgramManagement": DegreeProgramManagement,
    "DocumentCenter": DocumentCenter,
    "EmployeeDirectory": EmployeeDirectory,
    "EnrollmentDashboard": EnrollmentDashboard,
    "GlobalSubmissionViewer": GlobalSubmissionViewer,
    "HRManagement": HRManagement,
    "HelpDeskSystem": HelpDeskSystem,
    "HighPerformersBoard": HighPerformersBoard,
    "Home": Home,
    "InternalMessages": InternalMessages,
    "LeaveManagement": LeaveManagement,
    "LecturerCourseSelection": LecturerCourseSelection,
    "LecturerDashboard": LecturerDashboard,
    "LecturerIDManagement": LecturerIDManagement,
    "LecturerPerformanceDashboard": LecturerPerformanceDashboard,
    "LecturerProfilePage": LecturerProfilePage,
    "LecturerRegistrationPublic": LecturerRegistrationPublic,
    "LecturerTutorial": LecturerTutorial,
    "NotificationCenter": NotificationCenter,
    "NotificationPreferences": NotificationPreferences,
    "Notifications": Notifications,
    "OnboardingManagement": OnboardingManagement,
    "PayrollManagement": PayrollManagement,
    "PerformanceReviewSystem": PerformanceReviewSystem,
    "Programs": Programs,
    "ProgramsCatalog": ProgramsCatalog,
    "ReceptionDashboard": ReceptionDashboard,
    "ReconstructTransferHistory": ReconstructTransferHistory,
    "ReportingDashboard": ReportingDashboard,
    "StaffApplicationPortal": StaffApplicationPortal,
    "StaffApplicationReview": StaffApplicationReview,
    "StaffOnboarding": StaffOnboarding,
    "StaffSupport": StaffSupport,
    "StudentProfile": StudentProfile,
    "StudentProfilePage": StudentProfilePage,
    "StudentSupport": StudentSupport,
    "StudentTutorial": StudentTutorial,
    "StudentsNeedingHelp": StudentsNeedingHelp,
    "SubmissionManagement": SubmissionManagement,
    "SystemSettings": SystemSettings,
    "TestTranscriptGenerator": TestTranscriptGenerator,
    "UniversityAnnouncements": UniversityAnnouncements,
    "VirtualAdminOffice": VirtualAdminOffice,
    "course-detail": courseDetail,
    "PublicCourseDetail": PublicCourseDetail,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
