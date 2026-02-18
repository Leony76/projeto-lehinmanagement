"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import { useUserStore } from "../hooks/store/useUserStore";

export function ToastHandler() {
  const user = useUserStore((stats) => stats.user);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  
  useEffect(() => {
  const successType = searchParams.get('success');
  const nameFromUrl = searchParams.get('name'); 

  if (successType && (nameFromUrl || user?.name)) {
    const fullDisplayName = nameFromUrl || user?.name;
    const firstName = fullDisplayName?.split(' ')[0];

    if (successType === 'login') {
      showToast(`Bem-vindo(a) de volta, ${firstName}!`, "success");
    } else if (successType === 'signup') {
      showToast(`Bem-vindo(a), ${fullDisplayName}!`, "success");
    }

    router.replace(pathname);
  }
}, [searchParams, user, pathname, router]);

  return null;
}