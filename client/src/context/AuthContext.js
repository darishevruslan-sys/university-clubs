import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const USERS_STORAGE_KEY = 'university-clubs-users';
const CURRENT_USER_STORAGE_KEY = 'university-clubs-current-user';

const AuthContext = createContext();

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Не удалось преобразовать данные из localStorage:', error);
    return fallback;
  }
};

const loadUsers = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = window.localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) {
    return [];
  }

  const parsed = safeParse(stored, []);
  return Array.isArray(parsed) ? parsed : [];
};

const saveUsers = (users) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.warn('Не удалось сохранить пользователей в localStorage:', error);
  }
};

const loadCurrentUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  const parsed = safeParse(stored, null);
  if (parsed && parsed.id && parsed.email) {
    return parsed;
  }

  return null;
};

const persistCurrentUser = (user) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (user) {
    try {
      window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.warn('Не удалось сохранить текущего пользователя в localStorage:', error);
    }
  } else {
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadCurrentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const users = loadUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = users.find((storedUser) => storedUser.email === normalizedEmail && storedUser.password === password);

    if (!existingUser) {
      return {
        success: false,
        message: 'Неверный email или пароль',
      };
    }

    const sanitized = sanitizeUser(existingUser);
    setUser(sanitized);
    persistCurrentUser(sanitized);

    return { success: true };
  }, []);

  const register = useCallback(async (name, email, password) => {
    const users = loadUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find((storedUser) => storedUser.email === normalizedEmail);
    if (existingUser) {
      return {
        success: false,
        message: 'Пользователь с таким email уже зарегистрирован',
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    const sanitized = sanitizeUser(newUser);
    setUser(sanitized);
    persistCurrentUser(sanitized);

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistCurrentUser(null);
  }, []);

  const fetchUserProfile = useCallback(async () => {
    const current = loadCurrentUser();
    setUser(current);
    return current;
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    fetchUserProfile,
  }), [user, loading, login, register, logout, fetchUserProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
