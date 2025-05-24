"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedFileTypes: string;
  isLoading?: boolean;
}

export default function FileUpload({
  onFileUpload,
  acceptedFileTypes,
  isLoading = false,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
      // Limpia el estado para forzar nueva selección si el archivo cambia
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Limpia el input también
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex sm:tems-center gap-4 sm:flex-row flex-col">
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          className="flex-1"
        >
          <Upload className="mr-2 h-4 w-4" />
          Seleccionar Archivo
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          className="hidden"
        />

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
          className="flex-1"
        >
          {isLoading ? "Procesando..." : "Procesar Archivo"}
        </Button>
      </div>

      {selectedFile && (
        <div className="text-sm">
          Archivo seleccionado:{" "}
          <span className="font-medium">{selectedFile.name}</span>
        </div>
      )}
    </div>
  );
}
