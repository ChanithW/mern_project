import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = async (username, password, subsystem) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Check if user has access to the requested subsystem
      if (!checkSubsystemAccess(data.user.role, subsystem)) {
        throw new Error('You do not have access to this subsystem');
      }
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      // Redirect based on role
      redirectBasedOnRole(data.user.role);
      
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  const checkSubsystemAccess = (role, subsystem) => {
    const accessMap = {
      'Finance management': ['Finance officer', 'Owner'],
      'Employee management': ['Estate manager', 'Supervisor'],
      'Fertilization & disease management': ['Agricultural technician', 'Supervisor'],
      'Inventory management': ['Inventory manager'],
      'Order & delivery management': ['Driver', 'Inventory manager'],
      'Admin management': ['Owner'] // ✅ Add this if it's a valid subsystem
    };
  
    const allowedRoles = accessMap[subsystem];
    return allowedRoles ? allowedRoles.includes(role) : false;
  };
  
  
  const redirectBasedOnRole = (role) => {
    const roleRoutes = {
      'Owner': '/finance-dashboard',
      'Finance officer': '/finance-dashboard',
      'Estate manager': '/employee-dashboard',
      'Supervisor': '/fertilization-dashboard',
      'Agricultural technician': '/fertilization-dashboard',
      'Inventory manager': '/inventory-dashboard',
      'Driver': '/delivery-dashboard'
    };
    
    navigate(roleRoutes[role] || '/');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;