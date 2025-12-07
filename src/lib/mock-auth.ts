// Mock Authentication System for Development
// Uses localStorage to simulate authentication

export interface User {
  id: string;
  email: string;
  name: string;
  programmingLanguage?: string;
  developmentEnvironment?: string;
}

export interface AuthResult {
  error?: { message: string };
  data?: { user: User };
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Sign up new user
export async function signUpMock(data: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if user already exists
  const users = getAllUsers();
  const existingUser = users.find(u => u.email === data.email);

  if (existingUser) {
    return {
      error: { message: 'Email already exists' }
    };
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email: data.email,
    name: data.name,
  };

  // Save user
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Set as current user
  localStorage.setItem('currentUser', JSON.stringify(newUser));

  return {
    data: { user: newUser }
  };
}

// Sign in existing user
export async function signInMock(data: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const users = getAllUsers();
  const user = users.find(u => u.email === data.email);

  if (!user) {
    return {
      error: { message: 'Invalid email or password' }
    };
  }

  // Set as current user
  localStorage.setItem('currentUser', JSON.stringify(user));

  return {
    data: { user }
  };
}

// Sign out
export async function signOutMock(): Promise<void> {
  localStorage.removeItem('currentUser');
}

// Update user profile
export async function updateUserProfile(updates: {
  programmingLanguage?: string;
  developmentEnvironment?: string;
}): Promise<AuthResult> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const currentUser = getCurrentUser();
  if (!currentUser) {
    return {
      error: { message: 'Not authenticated' }
    };
  }

  // Update user
  const updatedUser = { ...currentUser, ...updates };

  // Update in users list
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === currentUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Update current user
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));

  return {
    data: { user: updatedUser }
  };
}

// Helper to get all users
function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];

  const usersStr = localStorage.getItem('users');
  if (!usersStr) return [];

  try {
    return JSON.parse(usersStr);
  } catch {
    return [];
  }
}

// Session hook replacement
export function useSessionMock() {
  if (typeof window === 'undefined') {
    return {
      data: null,
      isPending: false,
    };
  }

  const [user, setUser] = React.useState<User | null>(getCurrentUser());
  const [isPending, setIsPending] = React.useState(true);

  React.useEffect(() => {
    setUser(getCurrentUser());
    setIsPending(false);
  }, []);

  return {
    data: user ? { user } : null,
    isPending,
  };
}

// For React import
import React from 'react';
