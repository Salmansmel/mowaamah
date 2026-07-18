'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from './useAuth';
import { getUploadRecord } from '@/lib/firestore';
import { generateMockAnalysis } from '@/lib/mockAnalysis';
import { AnalysisResult } from '@/lib/types';

const STORAGE_KEY = 'mowaamah:lastAnalysis';

export function useAnalysisResult() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const uploadId = searchParams.get('uploadId');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      setLoading(true);

      const cached = window.sessionStorage.getItem(STORAGE_KEY);
      if (cached) {
        if (!cancelled) {
          setResult(JSON.parse(cached));
          setLoading(false);
        }
        return;
      }

      if (uploadId && user) {
        const record = await getUploadRecord(user.uid, uploadId);
        if (record && !cancelled) {
          setResult(record);
          setLoading(false);
          return;
        }
      }

      const demo = await generateMockAnalysis('عرض-تجريبي.pdf', 'fintech-payments');
      if (!cancelled) {
        setResult(demo);
        setLoading(false);
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, [uploadId, user]);

  return { result, loading };
}
