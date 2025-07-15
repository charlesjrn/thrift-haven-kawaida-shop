
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (userData: { username: string; password: string; role: 'admin' | 'cashier' }) => void;
  updateUser: (id: string, userData: { username: string; password?: string; role: 'admin' | 'cashier' }) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@winesandspirits.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: '2',
    username: 'cashier1',
    email: 'cashier1@winesandspirits.com',
    role: 'cashier',
    createdAt: new Date().toISOString(),
    isActive: true
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('pos_user');
    const savedUsers = localStorage.getItem('pos_users');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pos_users', JSON.stringify(users));
  }, [users]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with real API call
    const foundUser = users.find(u => u.username === username);
    
    if (foundUser && (password === 'admin123' || password === 'cashier123')) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('pos_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pos_user');
  };

  const addUser = (userData: { username: string; password: string; role: 'admin' | 'cashier' }) => {
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: `${userData.username}@winesandspirits.com`,
      role: userData.role,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: { username: string; password?: string; role: 'admin' | 'cashier' }) => {
    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...user, username: userData.username, role: userData.role }
        : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      isAuthenticated, 
      login, 
      logout, 
      addUser, 
      updateUser, 
      deleteUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
