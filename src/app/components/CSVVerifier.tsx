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
    <div className="space-y-6">
      <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p>{error}</p>
        </div>
      )}
      {result && (
        <div className="transition-all duration-500 ease-in-out transform">
          <VerificationResult result={result} />
        </div>
      )}
    </div>
  );
}