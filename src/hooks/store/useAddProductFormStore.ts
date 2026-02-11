import { Category } from "@prisma/client";
import { RefObject, useEffect, useRef } from "react";
import { UseFormReset, UseFormWatch } from "react-hook-form";

type FormData = {
  name: string;
  category: Category;
  price: string;
  stock: string;
  imageUrl?: string;
  description?: string;
};

type Props = {
  watch: UseFormWatch<FormData>;
  reset: UseFormReset<FormData>;
  FORM_STORAGE_KEY: string | null;
  shouldPersistRef: RefObject<boolean>
};

export const useAddProductFormStore = ({
  watch,
  reset,
  FORM_STORAGE_KEY,
  shouldPersistRef,
}: Props) => {

  const didHydrateRef = useRef(false);

  useEffect(() => {
    if (!FORM_STORAGE_KEY) return;

    const subscription = watch((value) => {
      if (!shouldPersistRef.current) return;
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [watch, FORM_STORAGE_KEY, shouldPersistRef]);

  useEffect(() => {
    if (!FORM_STORAGE_KEY) return;
    if (didHydrateRef.current) return;

    const saved = localStorage.getItem(FORM_STORAGE_KEY);
    if (saved) {
      reset(JSON.parse(saved));
    }

    didHydrateRef.current = true;
  }, [reset, FORM_STORAGE_KEY]);
};

