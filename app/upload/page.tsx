'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SectorDropdown } from '@/components/upload/SectorDropdown';
import { FileDropzone } from '@/components/upload/FileDropzone';
import { LoadingOverlay } from '@/components/upload/LoadingOverlay';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { saveUploadRecord } from '@/lib/firestore';
import { AnalysisResult } from '@/lib/types';

const ANALYSIS_STORAGE_KEY = 'mowaamah:lastAnalysis';

function UploadContent() {
  const { dict } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();

  const [sector, setSector] = useState('fintech-payments');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!file || !user) return;
    setSubmitting(true);
    setError(null);

    try {
      const uploadId = crypto.randomUUID();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('sector', sector);

      const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      const analysis: AnalysisResult = await response.json();

      const record = {
        ...analysis,
        id: uploadId,
        fileName: file.name,
        sector,
      };

      await saveUploadRecord(user.uid, uploadId, record);
      window.sessionStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(record));

      router.push(`/analysis?uploadId=${uploadId}`);
    } catch {
      setError(dict.auth.errorGeneric);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar variant="app" />
      <LoadingOverlay visible={submitting} message={dict.upload.loading} />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-16">
        <GlassCard className="p-8">
          <h1 className="mb-8 text-2xl font-bold text-text">{dict.upload.title}</h1>

          <div className="flex flex-col gap-6">
            <SectorDropdown value={sector} onChange={setSector} />
            <FileDropzone selectedFile={file} onFileSelected={setFile} onClear={() => setFile(null)} />

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button
              onClick={handleSubmit}
              disabled={!file || submitting}
              glow
              className="mt-2 w-full"
            >
              {dict.upload.submit}
            </Button>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <UploadContent />
    </ProtectedRoute>
  );
}
