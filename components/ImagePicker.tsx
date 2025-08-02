"use client";

import QUERY_KEY from "@/constants/queryKey";
import api from "@/services/api";
import { FileStorage } from "@/types/api/FileStorage";
import { validateImageFileType } from "@/validators/file";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { HTMLProps, useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "react-toastify";

type ImagePickerProps = HTMLProps<HTMLInputElement> & {
  fileStorage?: FileStorage;
  url?: string;
  onFileChange?: (file: FileStorage) => void;
  errorMessage?: string;
};

export default function ImagePicker({
  fileStorage,
  url,
  onFileChange,
  errorMessage,
  ...props
}: ImagePickerProps) {
  const [file, setFile] = useState<FileStorage | null>(null);

  const { mutate } = useMutation({
    mutationKey: [QUERY_KEY.UPLOAD_FILE],
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

  function handleFileChange(blobFile: File) {
    if (!validateImageFileType(blobFile)) {
      toast.error("Tipo de arquivo não suportado");
      return;
    }

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
      <label
        htmlFor="image-picker"
        data-test="image-picker"
        className="flex flex-col justify-center items-center w-full h-64 border rounded-xl cursor-pointer border-dashed border-gray-300 py-4"
      >
        {file?.url || url ? (
          <Image
            data-test="image-preview"
            src={file?.url || url || ""}
            width={400}
            height={400}
            alt=""
            className="h-full object-contain"
          />
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
          id="image-picker"
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.currentTarget?.files?.[0];

            if (!file) {
              return;
            }

            handleFileChange(file);
          }}
          value={""}
          {...props}
        />
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      </label>
    </div>
  );
}
