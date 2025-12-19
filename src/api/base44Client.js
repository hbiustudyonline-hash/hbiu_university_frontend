// Node.js Express backend API client
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://hbiuuniversitybackendnode-production.up.railway.app/api'
  : 'http://localhost:3001/api';

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
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized - clear token and redirect to home
    if (response.status === 401) {
      console.log('401 Unauthorized - clearing token');
      localStorage.removeItem('token');
      // Only redirect if not already on home page
      if (window.location.pathname !== '/' && window.location.pathname !== '/Home') {
        window.location.href = '/';
      }
      throw new Error('Unauthorized - please login again');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const base44 = {
  auth: {
    login: async (email, password) => {
      if (MOCK_MODE) {
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
          return {
            success: true,
            data: {
              user: mockUsers[email],
              token: 'mock-jwt-token-' + Date.now()
            }
          };
        } else {
          throw new Error('Invalid credentials');
        }
      }
      
      // Real backend login
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
        if (token && userData) {
          try {
            return Promise.resolve(JSON.parse(userData));
          } catch {
            // Fallback to default admin user
            return Promise.resolve({
              id: 1,
              firstName: 'Admin',
              lastName: 'User',
              full_name: 'Admin User',
              email: 'admin@hbiu.edu',
              role: 'admin'
            });
          }
        }
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
      list: (sort, limit) => {
        if (MOCK_MODE) {
          return Promise.resolve([]);
        }
        return apiRequest(`/courses?sort=${sort}&limit=${limit}`);
      },
      filter: (filters, sort, limit) => {
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
      list: (sort) => {
        if (MOCK_MODE) {
          return Promise.resolve([]);
        }
        return apiRequest(`/colleges?sort=${sort}`);
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
      list: (sort, limit) => {
        if (MOCK_MODE) {
          return Promise.resolve([]);
        }
        return apiRequest(`/assignments?sort=${sort}&limit=${limit}`);
      }
    },
    Announcement: {
      list: (sort, limit) => {
        if (MOCK_MODE) {
          return Promise.resolve([]);
        }
        return apiRequest(`/announcements?sort=${sort}&limit=${limit}`);
      }
    },
    Submission: {
      list: (sort) => {
        if (MOCK_MODE) {
          return Promise.resolve([]);
        }
        return apiRequest(`/submissions?sort=${sort}`);
      }
    }
  }
};