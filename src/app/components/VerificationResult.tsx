import React from 'react';
import { VerificationResult as VerificationResultType } from '../types';

interface VerificationResultProps {
  result: VerificationResultType;
}

export default function VerificationResult({ result }: VerificationResultProps) {
  const hasCSVDuplicates = result.duplicates.length > 0;
  const hasSupabaseDuplicates = result.supabaseDuplicates.length > 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Verification Result</h2>
      <div className={`p-4 rounded-md ${result.isUnique ? 'bg-green-100' : 'bg-red-100'}`}>
        <p className={`text-lg font-semibold ${result.isUnique ? 'text-green-700' : 'text-red-700'}`}>
          IDs are {result.isUnique ? 'unique' : 'not unique'}
        </p>
      </div>
      {(hasCSVDuplicates || hasSupabaseDuplicates) && (
        <div className="mt-4 space-y-4">
          {hasCSVDuplicates && (
            <div>
              <p className="font-semibold text-gray-700">Duplicate IDs in CSV:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {result.duplicates.map((dup, index) => (
                  <li key={index} className="text-sm text-gray-600">{dup}</li>
                ))}
              </ul>
            </div>
          )}
          {hasSupabaseDuplicates && (
            <div>
              <p className="font-semibold text-gray-700">IDs already in Supabase:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {result.supabaseDuplicates.map((dup, index) => (
                  <li key={index} className="text-sm text-gray-600">{dup}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}