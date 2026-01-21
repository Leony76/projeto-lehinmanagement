"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Toast from "@/src/components/ui/Toast";
import { ToastType } from "../constants/generalConfigs";

type ToastContextData = {
  showToast: (value: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextData | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("success");

  const showToast = (value: string, toastType: ToastType = "success") => {
    setMessage(value);
    setType(toastType);
    setIsOpen(true);

    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        value={message}
        type={type}
        isOpen={isOpen}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};
