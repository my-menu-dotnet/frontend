"use client";

import api from "@/services/api";
import { FileStorage } from "@/types/api/FileStorage";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

type ImagePickerProps = {
  fileStorage: FileStorage | undefined;
  onFileChange?: (file: FileStorage) => void;
};

export default function ImagePicker({
  fileStorage,
  onFileChange,
}: ImagePickerProps) {
  const [file, setFile] = useState<FileStorage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate } = useMutation({
    mutationKey: ["uploadFile"],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/file/upload", formData);
      return response.data as FileStorage;
    },
    onSuccess: (data: FileStorage) => {
      setFile(data);
    },
  });

  function handleOpenFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange() {
    const blobFile = fileInputRef.current?.files?.[0];
    if (blobFile) {
      mutate(blobFile);
    }
  }

  useEffect(() => {
    if (file && onFileChange && file !== fileStorage) {
      onFileChange(file);
    }
  }, [file]);

  useEffect(() => {
    if (fileStorage) {
      setFile(fileStorage);
    }
  }, [fileStorage]);

  return (
    <div className="relative">
      <div
        onClick={handleOpenFile}
        className="flex flex-col justify-center items-center w-full h-64 border rounded-xl cursor-pointer border-dashed border-gray-300"
      >
        {file?.url ? (
          <Image src={file.url} width={100} height={100} alt="" />
        ) : (
          <>
            <IoCloudUploadOutline size={30} />
            <p>Arraste e solte a imagem ou clique para fazer upload</p>
            <p className="text-sm text-gray-400">
              Tipos suportados: JPG, JPEG, PNG, WEBP
            </p>
          </>
        )}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          value={""}
        />
      </div>
    </div>
  );
}
