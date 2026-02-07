import { useEffect } from "react";

export const useLockScrollY = (value: boolean) => {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (value) {
      timer = setTimeout(() => {
        document.body.style.overflow = "hidden";
      }, 100);
    } else {
      timer = setTimeout(() => {
        document.body.style.overflow = "";
      }, 100);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [value]);
};