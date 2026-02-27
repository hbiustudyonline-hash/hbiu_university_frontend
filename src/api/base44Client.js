// Node.js Express backend API client
import coursesData from '@/data/courses.json';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://hbiuuniversitybackendnode-production.up.railway.app/api'
  : 'http://localhost:5001/api';

// TEMPORARY: Enable mock mode to bypass backend authentication
const MOCK_MODE = true;

// TEMPORARY: Don't clear bypass tokens on app load (allow mock-bypass-token)
(() => {
  const token = localStorage.getItem('token');
  // Only clear old malformed mock tokens, not our bypass token
  if (token && token.startsWith('mock-jwt-token')) {
    console.log('Clearing old mock-jwt-token');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  }
})();

// Get JWT token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  // TEMPORARY: Allow mock-bypass-token, only clear malformed tokens
  if (token && token.startsWith('mock-jwt-token')) {
    localStorage.removeItem('token');
    return null;
  }
  return token;
};

// Map college names from courses.json to match Colleges page names
const normalizeCollegeName = (collegeName) => {
  const collegeNameMap = {
    'College of Business & Economics': 'College of Business Economics',
    'College of Architecture, Arts, and Design': 'College of Architecture, Arts and Design',
    'College of Arts and Human': 'College of Arts and Humanities',
    'College of Earth, Science, and Industrial Technology': 'College of Earth Science and Industrial Technologies',
    'College of Education and Human': 'College of Education and Human Development',
    'College of Science and': 'College of Science and Engineering',
    'College of Tourism and Hospitality Management': 'College of Tourism, Hospitality, Management',
    'HBIU College for Coach': 'HBIU College of Coaching',
    'HBIU College for Fashion Design': 'HBIU College of Fashion Design',
    'HBIU College for Prior Learning': 'HBIU College for Prior Learning',
    'HBIU Training Institute Certificate Courses': 'HBIU Training Institute',
    'HBIU School of Nature': 'College of Nature',
    'HBI School of Cosmetology': 'College of Cosmetology',
  };
  
  return collegeNameMap[collegeName] || collegeName;
};

// LocalStorage-backed storage for mock mode created courses
const getMockCreatedCourses = () => {
  try {
    const stored = localStorage.getItem('mockCreatedCourses');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading mock courses from localStorage:', e);
    return [];
  }
};

const saveMockCreatedCourses = (courses) => {
  try {
    localStorage.setItem('mockCreatedCourses', JSON.stringify(courses));
    console.log('💾 Saved', courses.length, 'mock courses to localStorage');
  } catch (e) {
    console.error('Error saving mock courses to localStorage:', e);
  }
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  console.log('[API] Requesting:', endpoint, 'URL:', url);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
  };

  const config = { ...defaultOptions, ...options };
  if (config.headers && options.headers) {
    config.headers = { ...defaultOptions.headers, ...options.headers };
  }
  
  try {
    console.log('[API] Fetching from:', url);
    const response = await fetch(url, config);
    
    console.log('[API] Response status:', response.status, 'for:', endpoint);
    
    // Handle 401 Unauthorized - throw error but let caller handle redirect
    if (response.status === 401) {
      console.error('[API] 401 Unauthorized from:', endpoint);
      // Don't automatically redirect - let the calling code decide what to do
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Unauthorized - please login again');
      error.status = 401;
      throw error;
    }
    
    if (!response.ok) {
      console.error('[API] Response not OK:', response.status, 'for:', endpoint);
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    
    const data = await response.json();
    console.log('[API] Success response from:', endpoint);
    return data;
  } catch (error) {
    console.error('[API] Error on', endpoint + ':', error.message);
    throw error;
  }
};

export const base44 = {
  auth: {
    login: async (email, password) => {
      console.log('[AUTH] Login attempt for:', email);
      
      if (MOCK_MODE) {
        console.log('[AUTH] Using MOCK MODE');
        // Mock login for testing without backend
        const mockUsers = {
          'admin@hbiu.edu': { 
            id: 1, 
            firstName: 'Admin', 
            lastName: 'User', 
            full_name: 'Admin User',
            email: 'admin@hbiu.edu', 
            role: 'admin' 
          },
          'student@hbiu.edu': { 
            id: 2, 
            firstName: 'Student', 
            lastName: 'User', 
            full_name: 'Student User',
            email: 'student@hbiu.edu', 
            role: 'student' 
          },
          'lecturer@hbiu.edu': { 
            id: 3, 
            firstName: 'Lecturer', 
            lastName: 'User', 
            full_name: 'Lecturer User',
            email: 'lecturer@hbiu.edu', 
            role: 'lecturer' 
          },
          'john.smith@hbiu.edu': { 
            id: 3, 
            firstName: 'John', 
            lastName: 'Smith', 
            full_name: 'John Smith',
            email: 'john.smith@hbiu.edu', 
            role: 'lecturer' 
          },
          'college@hbiu.edu': { 
            id: 4, 
            firstName: 'College', 
            lastName: 'Admin', 
            full_name: 'College Admin',
            email: 'college@hbiu.edu', 
            role: 'college_admin' 
          }
        };
        
        if (mockUsers[email] && password === 'password123') {
          const token = 'mock-jwt-token-' + Date.now();
          const user = mockUsers[email];
          
          // Ensure token and userData are stored before returning
          localStorage.setItem('token', token);
          localStorage.setItem('userData', JSON.stringify(user));
          console.log('[AUTH] Mock login successful, stored token and userData');
          
          return {
            success: true,
            data: {
              user: user,
              token: token
            }
          };
        } else {
          console.error('[AUTH] Invalid credentials for mock mode');
          throw new Error('Invalid credentials');
        }
      }
      
      // Real backend login
      console.log('[AUTH] Calling real backend API for login');
      return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    register: async (userData) => {
      if (MOCK_MODE) {
        // Mock registration
        const newUser = {
          id: Date.now(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role
        };
        return Promise.resolve({
          success: true,
          user: newUser,
          token: 'mock-jwt-token-' + Date.now()
        });
      }
      
      // Real backend registration
      const { firstName, lastName, email, password, role } = userData;
      return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });
    },
    me: () => {
      if (MOCK_MODE) {
        const token = getAuthToken();
        const userData = localStorage.getItem('userData');
        console.log('[AUTH] me() called in MOCK MODE. Has token:', !!token, 'Has userData:', !!userData);
        
        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            console.log('[AUTH] Returning stored mock user:', parsedUser.email);
            // Return in the same format as the real API
            return Promise.resolve({
              success: true,
              data: parsedUser
            });
          } catch (error) {
            console.error('[AUTH] Error parsing userData:', error);
            // Fallback to default admin user
            return Promise.resolve({
              success: true,
              data: {
                id: 1,
                firstName: 'Admin',
                lastName: 'User',
                full_name: 'Admin User',
                email: 'admin@hbiu.edu',
                role: 'admin'
              }
            });
          }
        }
        console.log('[AUTH] No token or userData in mock me()');
        return Promise.reject(new Error('No token'));
      }
      return apiRequest('/auth/me');
    },
    logout: (redirectUrl) => {
      localStorage.removeItem('token');
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
      return Promise.resolve();
    },
    redirectToLogin: (returnUrl) => {
      // For now, just redirect to home with login modal
      // In a full implementation, you might redirect to a dedicated login page
      window.location.href = returnUrl || '/';
    },
    updateMe: async (userData) => {
      if (MOCK_MODE) {
        // Mock update - just return the updated user data
        const currentUser = await base44.auth.me();
        const updatedUser = { ...currentUser, ...userData };
        return Promise.resolve(updatedUser);
      }
      
      return apiRequest('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    }
  },
  
  // Add entities object for other API calls
  entities: {
    Course: {
      list: (sort = '-created_at', limit = 100) => {
        if (MOCK_MODE) {
          // Convert courses from courses.json to match the expected format
          const formattedCourses = coursesData.courses.map((course, index) => ({
            id: index + 1,
            code: course.code,
            title: course.title,
            description: course.description,
            category: course.title,
            level: course.program,
            credits: course.credits,
            semester: course.semester || 'Fall 2025',
            status: 'published',
            instructor: 'john.smith@hbiu.edu', // Default instructor for existing courses
            instructor_name: 'John Smith',
            startDate: course.semester === 'Semester 1' ? '2025-09-01' : '2026-01-15',
            thumbnail: course.image,
            college_id: String((index % 24) + 1), // Store as string to match College IDs
            college: { 
              id: String((index % 24) + 1), 
              name: normalizeCollegeName(course.college)
            }
          }));
          
          // Add courses for colleges not in courses.json
          const additionalCourses = [
            // College of International Studies
            {
              id: formattedCourses.length + 1,
              code: 'IRD 358',
              title: 'Intelligence & Foreign Policy',
              description: 'Comprehensive study of intelligence operations and foreign policy strategies.',
              category: 'Intelligence Studies',
              level: 'Bachelor',
              credits: 3,
              semester: 'Fall 2025',
              status: 'published',
              instructor: 'john.smith@hbiu.edu',
              instructor_name: 'John Smith',
              startDate: '2025-09-01',
              thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
              college_id: '10',
              college: { id: '10', name: 'College of International Studies' }
            },
            {
              id: formattedCourses.length + 2,
              code: 'IRD 356',
              title: 'International Trade Policy',
              description: 'Analysis of international trade patterns and policy frameworks.',
              category: 'Economics',
              level: 'Bachelor',
              credits: 3,
              semester: 'Spring 2026',
              status: 'published',
              instructor: 'john.smith@hbiu.edu',
              instructor_name: 'John Smith',
              startDate: '2025-09-01',
              thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
              college_id: '10',
              college: { id: '10', name: 'College of International Studies' }
            },
            {
              id: formattedCourses.length + 3,
              code: 'GTE 359',
              title: 'Global Financial Crises',
              description: 'Examination of global financial crises and crisis management strategies.',
              category: 'Finance',
              level: 'Bachelor',
              credits: 3,
              semester: 'Fall 2025',
              status: 'published',
              instructor: 'john.smith@hbiu.edu',
              instructor_name: 'John Smith',
              startDate: '2025-09-01',
              thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
              college_id: '10',
              college: { id: '10', name: 'College of International Studies' }
            },
            // College of Aviation
            {
              id: formattedCourses.length + 4,
              code: 'AVN 101',
              title: 'Introduction to Aviation',
              description: 'Fundamentals of aviation including flight principles and aircraft systems.',
              category: 'Aviation Fundamentals',
              level: 'Bachelor',
              credits: 3,
              semester: 'Fall 2025',
              status: 'published',
              instructor: 'john.smith@hbiu.edu',
              instructor_name: 'John Smith',
              startDate: '2025-09-01',
              thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
              college_id: '4',
              college: { id: '4', name: 'College of Aviation' }
            },
            {
              id: formattedCourses.length + 5,
              code: 'AVN 250',
              title: 'Aircraft Operations',
              description: 'Aircraft operations, maintenance procedures, and safety protocols.',
              category: 'Operations',
              level: 'Bachelor',
              credits: 4,
              semester: 'Spring 2026',
              status: 'published',
              instructor: 'john.smith@hbiu.edu',
              instructor_name: 'John Smith',
              startDate: '2025-09-01',
              thumbnail: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80',
              college_id: '4',
              college: { id: '4', name: 'College of Aviation' }
            },
            // Health Sciences - Nursing courses
            {
              id: formattedCourses.length + 6,
              code: 'NUR 201',
              title: 'Fundamentals of Nursing',
              description: 'Core nursing skills, patient care techniques, and professional standards.',
              category: 'Nursing Practice',
              level: 'Bachelor',
              credits: 4,
              semester: 'Fall 2025',
              status: 'published',
              instructor: 'john.smith@hbiu.edu',
              instructor_name: 'John Smith',
              startDate: '2025-09-01',
              thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
              college_id: '9',
              college: { id: '9', name: 'College of Health Sciences' }
            }
          ];
          
          const mockCreatedCourses = getMockCreatedCourses();
          const allCourses = [...formattedCourses, ...additionalCourses, ...mockCreatedCourses];
          
          console.log('[Course.list] Total courses loaded:', allCourses.length);
          console.log('[Course.list] Mock created courses:', mockCreatedCourses.length);
          console.log('[Course.list] Sample colleges:', [...new Set(allCourses.map(c => c.college?.name || 'Unknown'))].slice(0, 10));
          
          return Promise.resolve(allCourses);
        }
        return apiRequest(`/courses`);
      },
      filter: async (filters, sort = '-created_at', limit = 100) => {
        if (MOCK_MODE) {
          // Get all courses and filter them
          const allCourses = await this.list(sort, limit);
          let filtered = allCourses;
          
          if (filters) {
            filtered = allCourses.filter(course => {
              return Object.entries(filters).every(([key, value]) => {
                // Handle different comparison types
                if (key === 'college_id') {
                  return String(course.college_id) === String(value) || String(course.college?.id) === String(value);
                }
                return String(course[key]) === String(value);
              });
            });
          }
          
          console.log('[Course.filter] Filters:', filters, 'Results:', filtered.length);
          return Promise.resolve(filtered);
        }
        return apiRequest(`/courses/filter`, {
          method: 'POST',
          body: JSON.stringify({ filters, sort, limit }),
        });
      },
      create: (courseData) => {
        if (MOCK_MODE) {
          // Create new course with proper format
          const newCourse = {
            id: Date.now().toString(),
            code: courseData.code,
            title: courseData.title,
            description: courseData.description || '',
            category: courseData.title,
            level: courseData.program || 'Bachelor',
            credits: courseData.credits || 3,
            semester: courseData.semester || 'Fall 2026',
            startDate: new Date().toISOString().split('T')[0],
            status: courseData.status || 'draft',
            enrollment_limit: courseData.enrollment_limit || 30,
            instructor: courseData.instructor || '',
            instructor_name: courseData.instructor_name || '',
            degree_program: courseData.degree_program || '',
            college_id: courseData.college_id,
            college_name: courseData.college_name,
            thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
            college: { 
              id: courseData.college_id, 
              name: courseData.college_name 
            }
          };
          
          // Add to localStorage-backed storage
          const currentCourses = getMockCreatedCourses();
          currentCourses.push(newCourse);
          saveMockCreatedCourses(currentCourses);
          
          console.log('✅ Course created in mock mode:', newCourse);
          console.log('📚 Total mock courses now:', currentCourses.length);
          
          return Promise.resolve(newCourse);
        }
        return apiRequest('/courses', {
          method: 'POST',
          body: JSON.stringify(courseData),
        });
      }
    },
    College: {
      list: (sort = '-created_at') => {
        if (MOCK_MODE) {
          // Return all colleges
          const mockColleges = [
            { id: '1', name: 'College of Agriculture and Natural Resources' },
            { id: '2', name: 'College of Architecture, Arts and Design' },
            { id: '3', name: 'College of Arts and Humanities' },
            { id: '4', name: 'College of Aviation' },
            { id: '5', name: 'College of Business Economics' },
            { id: '6', name: 'College of Cosmetology' },
            { id: '7', name: 'College of Earth Science and Industrial Technologies' },
            { id: '8', name: 'College of Education and Human Development' },
            { id: '9', name: 'College of Health Sciences' },
            { id: '10', name: 'College of International Studies' },
            { id: '11', name: 'College of Law' },
            { id: '12', name: 'College of Media and Communications' },
            { id: '13', name: 'College of Medicine' },
            { id: '14', name: 'College of Nature' },
            { id: '15', name: 'College of Psychology' },
            { id: '16', name: 'College of Public Health' },
            { id: '17', name: 'College of Science and Engineering' },
            { id: '18', name: 'College of Tourism, Hospitality, Management' },
            { id: '19', name: 'HBIU College for Prior Learning' },
            { id: '20', name: 'HBIU College of Coaching' },
            { id: '21', name: 'HBIU College of Fashion Design' },
            { id: '22', name: 'HBIU Graduate School' },
            { id: '23', name: 'HBIU Seminary' },
            { id: '24', name: 'HBIU Training Institute' }
          ];
          console.log('base44Client - College.list() called in MOCK_MODE');
          console.log('base44Client - Returning colleges:', mockColleges);
          console.log('base44Client - Colleges count:', mockColleges.length);
          return Promise.resolve(mockColleges);
        }
        return apiRequest(`/colleges`);
      }
    },
    Enrollment: {
      list: () => {
        if (MOCK_MODE) {
          return Promise.resolve([]);
        }
        return apiRequest('/enrollments');
      },
      filter: (filters) => {
        if (MOCK_MODE) {
          return Promise.resolve([]);
        }
        return apiRequest('/enrollments/filter', {
          method: 'POST',
          body: JSON.stringify(filters),
        });
      }
    },
    Assignment: {
      list: (sort = '-created_at', limit = 100) => {
        if (MOCK_MODE) {
          return Promise.resolve([]);
        }
        return apiRequest(`/assignments`);
      }
    },
    Announcement: {
      list: (sort = '-created_at', limit = 100) => {
        if (MOCK_MODE) {
          return Promise.resolve([]);
        }
        return apiRequest(`/announcements`);
      }
    },
    Submission: {
      list: (sort = '-created_at') => {
        if (MOCK_MODE) {
          return Promise.resolve([]);
        }
        return apiRequest(`/submissions`);
      }
    }
  }
};