import React from 'react';
import { VerificationResult as VerificationResultType } from '../types';

interface VerificationResultProps {
  result: VerificationResultType;
}

export default function VerificationResult({ result }: VerificationResultProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Verification Result</h2>
      <div className={`p-4 rounded-md ${result.isUnique ? 'bg-green-100' : 'bg-red-100'}`}>
        <p className={`text-lg font-semibold ${result.isUnique ? 'text-green-700' : 'text-red-700'}`}>
          IDs are {result.isUnique ? 'unique' : 'not unique'}
        </p>
      </div>
      {!result.isUnique && (
        <div className="mt-4">
          <p className="font-semibold text-gray-700">Duplicate IDs:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {result.duplicates.map((dup, index) => (
              <li key={index} className="text-sm text-gray-600">{dup}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}