
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define User type with roles
export type UserRole = "doctor" | "nurse" | "coordinator" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication service (replace with real API calls later)
const mockUsers: User[] = [
  { id: "1", name: "Dr. Jane Smith", email: "doctor@example.com", role: "doctor" },
  { id: "2", name: "Nurse Alex Johnson", email: "nurse@example.com", role: "nurse" },
  { id: "3", name: "Sam Coordinator", email: "coordinator@example.com", role: "coordinator" },
  { id: "4", name: "Admin User", email: "admin@example.com", role: "admin" }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("medisync_user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user by email (mock authentication)
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // Store user in local storage
      localStorage.setItem("medisync_user", JSON.stringify(foundUser));
      setUser(foundUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error("User already exists with this email");
      }
      
      // Create new user
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        role
      };
      
      mockUsers.push(newUser);
      
      // Auto login after registration
      localStorage.setItem("medisync_user", JSON.stringify(newUser));
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("medisync_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
