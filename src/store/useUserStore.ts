import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { SystemRoles } from "../constants/generalConfigs";

interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: SystemRoles; 
    emailVerified: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
  } | null;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    userAgent?: string | null;
  } | null;
  setUser: (user:any, session:any) => void;
  clearUser: () => void; 
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      setUser: (user, session) => set({ user, session }),
      clearUser: () => set({ user: null, session: null }),
    }),
    {
      name: 'user-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);