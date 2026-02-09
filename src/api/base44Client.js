// Node.js Express backend API client
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://hbiuuniversitybackendnode-production.up.railway.app/api'
  : 'http://localhost:5000/api';

// Temporary mock mode for testing (set to false when backend is running)
const MOCK_MODE = true;

// Clear any old mock tokens on app load
(() => {
  const token = localStorage.getItem('token');
  if (token && token.startsWith('mock-')) {
    console.log('Clearing old mock token');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  }
})();

// Get JWT token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  // Clear malformed mock tokens
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
          return Promise.resolve([]);
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