"use client";

import { useEffect } from "react";
import { authClient } from "@/src/lib/auth-client"; 
import { useUserStore } from "@/src/store/useUserStore";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    const syncAuth = async () => {
      const { data, error } = await authClient.getSession();
      
      if (data) {
        setUser(data.user, data.session);
      } else {
        clearUser();
      }
    };

    syncAuth();
  }, [setUser, clearUser]);

  return <>{children}</>;
}