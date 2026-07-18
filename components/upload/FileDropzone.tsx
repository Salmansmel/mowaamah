'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { validateFile } from '@/lib/fileValidation';
import { formatBytes, cn } from '@/lib/utils';

interface FileDropzoneProps {
  selectedFile: File | null;
  onFileSelected: (file: File) => void;
  onClear: () => void;
}

export function FileDropzone({ selectedFile, onFileSelected, onClear }: FileDropzoneProps) {
  const { dict } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    const validationError = validateFile(file);
    if (validationError === 'invalid-type') {
      setError(dict.upload.errorInvalidType);
      return;
    }
    if (validationError === 'too-large') {
      setError(dict.upload.errorTooLarge);
      return;
    }
    setError(null);
    onFileSelected(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  if (selectedFile) {
    return (
      <div className="glass flex items-center justify-between rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-light">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-text">{selectedFile.name}</p>
            <p className="text-xs text-text-muted">{formatBytes(selectedFile.size)}</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-text-muted transition-colors hover:text-danger"
          aria-label="Remove file"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors',
          isDragActive ? 'border-primary bg-primary/5 shadow-glow' : 'border-white/15 hover:border-white/25'
        )}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary-light">
          <Upload size={26} />
        </div>
        <p className="font-medium text-text">{dict.upload.dropzoneTitle}</p>
        <p className="mt-1 text-sm text-text-muted">
          {dict.upload.dropzoneOr}{' '}
          <span className="text-primary-light underline">{dict.upload.dropzoneBrowse}</span>
        </p>
        <p className="mt-3 text-xs text-text-muted">{dict.upload.dropzoneHint}</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}
    </div>
  );
}
