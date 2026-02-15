"use client"

import { authClient } from "@/src/lib/auth-client";
import { useUserStore } from "@/src/hooks/store/useUserStore";
import { useRouter } from "next/navigation";

export function Logout({ className, children }: { className?: string, children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          useUserStore.getState().clearUser();
          router.push("/login");
          router.refresh(); 
        },
      },
    });
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
}