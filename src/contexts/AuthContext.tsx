/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { UserAccount } from '@/types';
import { DEFAULT_USERS } from '@/constants/seed/users';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface AuthValue {
  currentUser: UserAccount | null;
  users: UserAccount[];
  /** Set the active user (login). Navigation is the caller's responsibility. */
  login: (user: UserAccount) => void;
  /** Append a new user and set them active (register). */
  register: (user: UserAccount) => void;
  logout: () => void;
  updateProfile: (user: UserAccount) => void;
  setUserRole: (userId: string, role: UserAccount['role']) => void;
}

export const AuthContext = React.createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [users, setUsers] = useLocalStorage<UserAccount[]>(STORAGE_KEYS.users, DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage<UserAccount | null>(
    STORAGE_KEYS.currentUser,
    null,
    { removeOnFalsy: true },
  );

  const value = React.useMemo<AuthValue>(
    () => ({
      currentUser,
      users,
      login: (user) => setCurrentUser(user),
      register: (user) => {
        setUsers((prev) => [...prev, user]);
        setCurrentUser(user);
      },
      logout: () => setCurrentUser(null),
      updateProfile: (updated) => {
        setCurrentUser(updated);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      },
      setUserRole: (userId, role) => {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
        setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, role } : prev));
      },
    }),
    [currentUser, users, setCurrentUser, setUsers],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
