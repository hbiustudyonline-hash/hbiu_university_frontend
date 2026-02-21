// Node.js Express backend API client
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
          // Mock courses for various colleges
          const mockCourses = [
            // College of International Studies
            {
              id: 1,
              code: 'IRD 358',
              title: 'Intelligence & Foreign Policy',
              description: 'Comprehensive study of intelligence operations and foreign policy strategies in the modern era.',
              category: 'Intelligence & Foreign Policy',
              level: 'Bachelor',
              credits: 3,
              startDate: '2025-09-01',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 2,
              code: 'IRD 356',
              title: 'International Trade Policy',
              description: 'Analysis of international trade patterns, policy frameworks, and global economic relations.',
              category: 'International Trade Policy',
              level: 'Bachelor',
              credits: 3,
              startDate: '2025-09-01',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 3,
              code: 'GTE 359',
              title: 'Global Financial Crises',
              description: 'Examination of global financial crises, regulatory frameworks, and crisis management strategies.',
              category: 'Global Financial Crises',
              level: 'Bachelor',
              credits: 3,
              startDate: '2025-09-01',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 4,
              code: 'GSC 285',
              title: 'Global Supply Chain Management',
              description: 'Introduction to international logistics, supply chain optimization, and cross-border operations.',
              category: 'Global Supply Chain Management',
              level: 'Bachelor',
              credits: 3,
              startDate: '2025-09-01',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 5,
              code: 'GTE 20',
              title: 'Global Markets & Competition',
              description: 'Study of international market dynamics, competitive strategies, and global business environments.',
              category: 'Global Markets & Competition',
              level: 'Bachelor',
              credits: 3,
              startDate: '2025-09-01',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 6,
              code: 'UNI 120',
              title: 'College Algebra or Quantitative Reasoning',
              description: 'Mathematical foundations including algebra, quantitative analysis, and problem-solving.',
              category: 'College Algebra or Quantitative Reasoning',
              level: 'Bachelor',
              credits: 3,
              startDate: '2025-09-01',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 7,
              code: 'ANT 240',
              title: 'Ethnographic Methods',
              description: 'Advanced qualitative research techniques for studying cultures and international communities.',
              category: 'Ethnographic Methods',
              level: 'Bachelor',
              credits: 3,
              startDate: '2026-01-15',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 8,
              code: 'IES 340',
              title: 'Environmental Risk & Resilience',
              description: 'Examination of environmental challenges, risk assessment, and resilience strategies.',
              category: 'Environmental Risk & Resilience',
              level: 'Bachelor',
              credits: 3,
              startDate: '2026-01-15',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 9,
              code: 'GTH 353',
              title: 'Cruise & Resort Management',
              description: 'Management principles for cruise lines, resorts, and international hospitality operations.',
              category: 'Cruise & Resort Management',
              level: 'Bachelor',
              credits: 3,
              startDate: '2026-01-15',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 10,
              code: 'ECM 315',
              title: 'Event & Convention Management',
              description: 'Planning and execution of international events, conventions, and conferences.',
              category: 'Event & Convention Management',
              level: 'Bachelor',
              credits: 3,
              startDate: '2026-01-15',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 11,
              code: 'RES 410',
              title: 'Research Design',
              description: 'Comprehensive training in quantitative and qualitative research methodology.',
              category: 'Research Design',
              level: 'PhD',
              credits: 4,
              startDate: '2025-09-01',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 12,
              code: 'MPG 475',
              title: 'Migration Policy & Global Governance',
              description: 'Analysis of global migration patterns, refugee policies, and governance frameworks.',
              category: 'Migration Policy & Global Governance',
              level: 'PhD',
              credits: 4,
              startDate: '2026-01-15',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 13,
              code: 'CTH 290',
              title: 'Christian Theology & Global Ethics',
              description: 'Exploration of Christian theological perspectives on international affairs.',
              category: 'Christian Theology & Global Ethics',
              level: 'Master',
              credits: 3,
              startDate: '2025-09-01',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 14,
              code: 'POL 380',
              title: 'Political Inquiry & Comparative Politics',
              description: 'Systematic study of political systems and comparative political analysis.',
              category: 'Political Inquiry & Comparative Politics',
              level: 'Master',
              credits: 3,
              startDate: '2026-01-15',
              college: { id: 1, name: 'College of International Studies' }
            },
            {
              id: 15,
              code: 'CRM 395',
              title: 'Cruise Line Operations & Management',
              description: 'Operational management principles for international cruise line operations.',
              category: 'Cruise Line Operations & Management',
              level: 'Bachelor',
              credits: 3,
              startDate: '2026-01-15',
              college: { id: 1, name: 'College of International Studies' }
            },
            
            // College of Nursing
            {
              id: 101,
              code: 'NUR201',
              title: 'Fundamentals of Nursing Practice',
              description: 'Core nursing skills, patient care techniques, and professional nursing standards.',
              category: 'Nursing Practice',
              level: 'Bachelor',
              credits: 4,
              startDate: '2025-09-01',
              college: { id: 2, name: 'College of Nursing' }
            },
            {
              id: 102,
              code: 'NUR310',
              title: 'Advanced Health Assessment',
              description: 'Comprehensive patient assessment techniques, diagnostic reasoning, and clinical decision-making.',
              category: 'Clinical Skills',
              level: 'Master',
              credits: 3,
              startDate: '2026-01-15',
              college: { id: 2, name: 'College of Nursing' }
            },
            
            // College of Business Administration
            {
              id: 201,
              code: 'BUS101',
              title: 'Introduction to Business Management',
              description: 'Foundational concepts in business operations, management principles, and organizational behavior.',
              category: 'Management',
              level: 'Bachelor',
              credits: 3,
              startDate: '2025-09-01',
              college: { id: 3, name: 'College of Business Administration' }
            },
            {
              id: 202,
              code: 'BUS305',
              title: 'Strategic Marketing',
              description: 'Advanced marketing strategies, consumer behavior analysis, and brand management.',
              category: 'Marketing',
              level: 'Master',
              credits: 3,
              startDate: '2025-09-01',
              college: { id: 3, name: 'College of Business Administration' }
            },
            
            // College of Engineering
            {
              id: 301,
              code: 'ENG105',
              title: 'Engineering Design & Innovation',
              description: 'Introduction to engineering design process, problem-solving, and innovative thinking.',
              category: 'Engineering',
              level: 'Bachelor',
              credits: 4,
              startDate: '2025-09-01',
              college: { id: 4, name: 'College of Engineering' }
            },
            {
              id: 302,
              code: 'ENG420',
              title: 'Advanced Systems Engineering',
              description: 'Complex systems analysis, integration techniques, and large-scale project management.',
              category: 'Systems',
              level: 'PhD',
              credits: 4,
              startDate: '2026-01-15',
              college: { id: 4, name: 'College of Engineering' }
            }
          ];
          
          return Promise.resolve(mockCourses);
        }
        return apiRequest(`/courses`);
      },
      filter: (filters, sort = '-created_at', limit = 100) => {
        if (MOCK_MODE) {
          return Promise.resolve([]);
        }
        return apiRequest(`/courses/filter`, {
          method: 'POST',
          body: JSON.stringify({ filters, sort, limit }),
        });
      },
      create: (courseData) => {
        if (MOCK_MODE) {
          return Promise.resolve({ id: Date.now(), ...courseData });
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
          return Promise.resolve([]);
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