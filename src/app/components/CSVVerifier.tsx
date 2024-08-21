'use client';

import React, { useState } from 'react';
import FileUpload from './FileUpload';
import VerificationConfig from './VerificationConfig';
import VerificationResult from './VerificationResult';
import { verifyCSV } from '../lib/csvHelpers/csvVerifier';
import {
  VerificationResult as VerificationResultType,
  VerificationConfig as VerificationConfigType,
} from '../types';

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

      // Handle validation errors
      if (
        verificationResult.validationErrors &&
        verificationResult.validationErrors.length > 0
      ) {
        const errorMessages = verificationResult.validationErrors.map(
          (err) => `Row ${err.row}: ${err.message}`
        );
        setError(`CSV Validation Errors:\n${errorMessages.join('\n')}`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          CSV File Upload
        </h2>
        <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
      </div>

      {csvHeaders.length > 0 && (
        <VerificationConfig
          onConfigChange={setConfig}
          csvHeaders={csvHeaders}
        />
      )}

      {csvHeaders.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleVerify}
            disabled={isLoading || !file || !config}
            className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify CSV'}
          </button>
        </div>
      )}

      {error && (
        <div
          className="whitespace-pre-wrap rounded border-l-4 border-red-500 bg-red-100 p-4 text-red-700"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="transform transition-all duration-500 ease-in-out">
          <VerificationResult result={result} />
        </div>
      )}
    </div>
  );
}
