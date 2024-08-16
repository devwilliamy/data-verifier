'use client';

import React, { useState } from 'react';
import FileUpload from './FileUpload';
import VerificationResult from './VerificationResult';
import { verifyCSV } from '../lib/csvVerifier';
import { VerificationResult as VerificationResultType } from '../types';

export default function CSVVerifier() {
  const [result, setResult] = useState<VerificationResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const verificationResult = await verifyCSV(file);
      setResult(verificationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {result && <VerificationResult result={result} />}
    </div>
  );
}