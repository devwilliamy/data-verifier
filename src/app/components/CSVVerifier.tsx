'use client';

import React, { useState } from 'react';
import FileUpload from './FileUpload';
import VerificationConfig from './VerificationConfig';
import VerificationResult from './VerificationResult';
import { verifyCSV } from '../lib/csvVerifier';
import { VerificationResult as VerificationResultType, VerificationConfig as VerificationConfigType } from '../types';

export default function CSVVerifier() {
  const [result, setResult] = useState<VerificationResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [config, setConfig] = useState<VerificationConfigType | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Parse CSV headers
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const headers = text.split('\n')[0].split(',');
      setCsvHeaders(headers);
    };
    reader.readAsText(selectedFile);
  };

  const handleVerify = async () => {
    if (!file || !config) {
      setError('Please select a file and configure verification settings');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const verificationResult = await verifyCSV(file, config);
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
      {csvHeaders.length > 0 && (
        <VerificationConfig onConfigChange={setConfig} csvHeaders={csvHeaders} />
      )}
      <button
        onClick={handleVerify}
        disabled={isLoading || !file || !config}
        className="px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Verifying...' : 'Verify CSV'}
      </button>
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