"use client";

import { useState, type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileText, XCircle } from "lucide-react";

export function FileUpload({ onFileSelect }: { onFileSelect?: (file: File) => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv") || 
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.name.endsWith(".xlsx") ||
          file.type === "application/vnd.ms-excel" || file.name.endsWith(".xls")) {
        setSelectedFile(file);
        setError(null);
        if (onFileSelect) {
          onFileSelect(file);
        }
      } else {
        setSelectedFile(null);
        setError("Invalid file type. Please upload a CSV or Excel file.");
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    // Also clear the input field value if possible, or notify parent to reset
    const fileInput = document.getElementById("file-upload-input") as HTMLInputElement;
    if (fileInput) {
        fileInput.value = "";
    }
  };

  return (
    <div className="space-y-3 p-4 border border-dashed rounded-md bg-accent/50">
      <Label htmlFor="file-upload-input" className="text-sm font-medium">
        Import Requirements (CSV/Excel)
      </Label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Input
            id="file-upload-input"
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileChange}
            className="hidden" // Hide default input
          />
          <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload-input')?.click()} className="w-full justify-start text-muted-foreground">
            <UploadCloud className="mr-2 h-4 w-4" />
            {selectedFile ? "Change file" : "Choose a file"}
          </Button>
        </div>
        {selectedFile && (
          <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} title="Remove file">
            <XCircle className="h-5 w-5 text-destructive" />
          </Button>
        )}
      </div>

      {selectedFile && (
        <div className="mt-2 p-2 border rounded-md bg-background text-sm flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="truncate flex-1">{selectedFile.name}</span>
          <span className="text-muted-foreground text-xs">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        This feature allows bulk import of requirements. The actual import logic is not yet implemented.
      </p>
    </div>
  );
}
