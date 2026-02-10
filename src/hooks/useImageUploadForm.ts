'use client'

import { useRef, useState } from "react";

type UseImageUploadFormReturn = {
  imageFile: File | null;
  preview: string | null;
  imageError: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  openFileDialog: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validateImage: () => boolean;
  uploadImage: () => Promise<string | null>;
  resetImage: () => void;
};

export function useImageUploadForm(): UseImageUploadFormReturn {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setImageError(null);
  };

  const validateImage = () => {
    if (!imageFile) {
      setImageError("A imagem do produto é obrigatória");
      return false;
    }
    return true;
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch("/api/image-upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.url ?? null;
  };

  const resetImage = () => {
    setImageFile(null);
    setPreview(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    imageFile,
    preview,
    imageError,
    fileInputRef,
    openFileDialog,
    onFileChange,
    validateImage,
    uploadImage,
    resetImage,
  };
}
