// Node.js Express backend API client
import coursesData from '@/data/courses.json';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://hbiuuniversitybackendnode-production.up.railway.app/api'
  : 'http://localhost:5000/api';

// TEMPORARY: Disable mock mode to use real backend authentication
const MOCK_MODE = false;

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

// Map college names to IDs
const getCollegeIdByName = (collegeName) => {
  // First apply the name mapping, then lowercase for lookup
  const mappedName = normalizeCollegeName(collegeName);
  const normalizedName = mappedName
    .replace(/[&,]/g, '') // Remove & and commas
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .trim()
    .toLowerCase();
  
  // Map uses normalized keys (lowercase, no punctuation) to match properly
  const collegeMap = {
    // Based on exact order from Colleges.jsx
    'college of international studies': '1', // id: 1
    'college of aviation': '2', // id: 2
    'college of chaplaincy': '3', // id: 3
    'college of naturopathic medicine': '4', // id: 4
    'college of addiction counseling': '5', // id: 5
    'college of agriculture and natural resources': '6', // id: 6
    'college of architecture arts and design': '7', // id: 7
    'college of arts and humanities': '8', // id: 8
    'college of behavioral social science': '9', // id: 9
    'college of business economics': '10', // id: 10
    'college of business and project management': '11', // id: 11
    'college of communication and media': '12', // id: 12
    'college of computer science': '13', // id: 13
    'college of earth science and industrial technologies': '14', // id: 14
    'college of education and human development': '15', // id: 15
    'college of health science': '16', // id: 16
    'college of law and public policy': '17', // id: 17
    'college of leadership': '18', // id: 18
    'college of performing arts': '19', // id: 19
    'college of science and engineering': '20', // id: 20
    'college of science and psychology': '21', // id: 21
    'college of science and social science': '22', // id: 22
    'college of social science and humanitarianism': '23', // id: 23
    'college of tourism hospitality management': '24', // id: 24
    'college of virtual and performing arts': '25', // id: 25
    'culinary institution college': '26', // id: 26
    'hbiu college of coaching': '27', // id: 27
    'hbiu college of fashion design': '28', // id: 28
    'hbiu college for prior learning': '29', // id: 29
    'hbiu medical training institute': '30', // id: 30
    'hbiu seminary': '31', // id: 31
    'hbiu training institute': '32', // id: 32
    'certificate courses': '33', // id: 33
    'hbi heart royalty international academy': '34', // id: 34
    'college preparatory high school': '35', // id: 35
    'college of cosmetology': '36', // id: 36
    'college of nature': '37' // id: 37
  };
  
  const mappedId = collegeMap[normalizedName];
  if (!mappedId) {
    console.warn('[getCollegeIdByName] No mapping found for normalized:', normalizedName, '- Original:', collegeName, '- Mapped:', mappedName);
  } else {
    console.log('[getCollegeIdByName] ✓ Mapped', collegeName, '→ ID', mappedId);
  }
  return mappedId || '1'; // Default to college 1 if not found
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
          const formattedCourses = coursesData.courses.map((course, index) => {
            // Get the proper college ID based on the course's original college name
            const collegeId = getCollegeIdByName(course.college);
            
            return {
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
              college_id: collegeId, // Use actual college ID from course data
              college: { 
                id: collegeId, 
                name: course.college // Keep original college name for display
              }
            };
          });
          
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
          
          // Debug: Show distribution of courses by college_id
          const collegeDistribution = {};
          const collegeNameDistribution = {};
          allCourses.forEach(c => {
            const id = c.college_id || 'undefined';
            const name = c.college?.name || 'Unknown';
            collegeDistribution[id] = (collegeDistribution[id] || 0) + 1;
            collegeNameDistribution[name] = (collegeNameDistribution[name] || 0) + 1;
          });
          console.log('[Course.list] Courses per college_id:', collegeDistribution);
          console.log('[Course.list] College of International Studies courses:', collegeNameDistribution['College of International Studies'] || 0);
          
          // Show sample International Studies courses
          const intlStudiesCourses = allCourses.filter(c => c.college?.name === 'College of International Studies');
          if (intlStudiesCourses.length > 0) {
            console.log('[Course.list] Sample International Studies courses:', intlStudiesCourses.slice(0, 3).map(c => ({
              code: c.code,
              title: c.title,
              college_id: c.college_id,
              college_name: c.college?.name
            })));
          }
          
          return Promise.resolve(allCourses);
        }
        return apiRequest(`/courses`);
      },
      filter: async (filters, sort = '-created_at', limit = 100) => {
        if (MOCK_MODE) {
          // Get all courses and filter them
          const allCourses = await this.list(sort, limit);
          let filtered = allCourses;
          
          console.log('[Course.filter] Starting filter. Total courses:', allCourses.length);
          console.log('[Course.filter] Filters received:', JSON.stringify(filters));
          
          if (filters) {
            filtered = allCourses.filter(course => {
              const matches = Object.entries(filters).every(([key, value]) => {
                // Handle different comparison types
                if (key === 'college_id') {
                  const courseCollegeId = String(course.college_id);
                  const filterValue = String(value);
                  const courseCollegeObjId = String(course.college?.id);
                  const match = courseCollegeId === filterValue || courseCollegeObjId === filterValue;
                  
                  // Log first 3 comparisons for debugging
                  if (filtered.length < 3) {
                    console.log(`  Comparing: course.college_id="${courseCollegeId}" vs filter="${filterValue}" → ${match}`);
                  }
                  
                  return match;
                }
                return String(course[key]) === String(value);
              });
              return matches;
            });
          }
          
          console.log('[Course.filter] ✅ Results:', filtered.length, 'courses found');
          if (filtered.length > 0) {
            console.log('[Course.filter] Sample:', filtered.slice(0, 3).map(c => ({
              title: c.title,
              college_id: c.college_id,
              college_name: c.college?.name
            })));
          }
          
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
    },
    AIInstructor: {
      list: () => {
        if (MOCK_MODE) {
          const mockAIInstructors = JSON.parse(localStorage.getItem('mockAIInstructors') || '[]');
          return Promise.resolve(mockAIInstructors);
        }
        return apiRequest('/ai-instructors');
      },
      filter: (filters) => {
        if (MOCK_MODE) {
          const mockAIInstructors = JSON.parse(localStorage.getItem('mockAIInstructors') || '[]');
          const filtered = mockAIInstructors.filter(instructor => 
            (!filters.course_id || instructor.course_id == filters.course_id)
          );
          return Promise.resolve(filtered);
        }
        return apiRequest('/ai-instructors/filter', {
          method: 'POST',
          body: JSON.stringify(filters),
        });
      },
      create: (data) => {
        if (MOCK_MODE) {
          const mockAIInstructors = JSON.parse(localStorage.getItem('mockAIInstructors') || '[]');
          const newInstructor = {
            id: mockAIInstructors.length + 1,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          mockAIInstructors.push(newInstructor);
          localStorage.setItem('mockAIInstructors', JSON.stringify(mockAIInstructors));
          console.log('✅ Mock AI Instructor created:', newInstructor);
          return Promise.resolve(newInstructor);
        }
        return apiRequest('/ai-instructors', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      },
      update: (id, data) => {
        if (MOCK_MODE) {
          const mockAIInstructors = JSON.parse(localStorage.getItem('mockAIInstructors') || '[]');
          const index = mockAIInstructors.findIndex(i => i.id == id);
          if (index !== -1) {
            mockAIInstructors[index] = {
              ...mockAIInstructors[index],
              ...data,
              updated_at: new Date().toISOString()
            };
            localStorage.setItem('mockAIInstructors', JSON.stringify(mockAIInstructors));
            console.log('✅ Mock AI Instructor updated:', mockAIInstructors[index]);
            return Promise.resolve(mockAIInstructors[index]);
          }
          return Promise.reject(new Error('AI Instructor not found'));
        }
        return apiRequest(`/ai-instructors/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },
      delete: (id) => {
        if (MOCK_MODE) {
          const mockAIInstructors = JSON.parse(localStorage.getItem('mockAIInstructors') || '[]');
          const filtered = mockAIInstructors.filter(i => i.id != id);
          localStorage.setItem('mockAIInstructors', JSON.stringify(filtered));
          console.log('✅ Mock AI Instructor deleted:', id);
          return Promise.resolve({ success: true });
        }
        return apiRequest(`/ai-instructors/${id}`, {
          method: 'DELETE',
        });
      }
    },
    
    User: {
      list: async (params = {}) => {
        // Always fetch from backend API for real user data
        try {
          const queryParams = new URLSearchParams(params).toString();
          const url = `/admin/users${queryParams ? '?' + queryParams : ''}`;
          const response = await apiRequest(url);
          // API response structure: { success, message, data: { users, pagination } }
          return response.data?.users || response.users || [];
        } catch (error) {
          console.error('[User.list] Error fetching users:', error);
          return [];
        }
      },
      get: async (id) => {
        try {
          const response = await apiRequest(`/users/${id}`);
          return response.user;
        } catch (error) {
          console.error(`[User.get] Error fetching user ${id}:`, error);
          throw error;
        }
      },
      update: async (id, data) => {
        try {
          const response = await apiRequest(`/admin/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          });
          return response.user;
        } catch (error) {
          console.error(`[User.update] Error updating user ${id}:`, error);
          throw error;
        }
      },
      updateStatus: async (id, status) => {
        try {
          const response = await apiRequest(`/admin/users/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
          });
          return response.user;
        } catch (error) {
          console.error(`[User.updateStatus] Error updating user status:`, error);
          throw error;
        }
      },
      updateRole: async (id, role) => {
        try {
          const response = await apiRequest(`/admin/users/${id}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
          });
          return response.user;
        } catch (error) {
          console.error(`[User.updateRole] Error updating user role:`, error);
          throw error;
        }
      }
    }
  },
  
  // Shortcut for easier access (base44.Course instead of base44.entities.Course)
  get Course() {
    return this.entities.Course;
  },
  get College() {
    return this.entities.College;
  },
  get AIInstructor() {
    return this.entities.AIInstructor;
  },
  get User() {
    return this.entities.User;
  }
};