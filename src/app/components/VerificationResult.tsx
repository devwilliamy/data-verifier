import React from 'react';
import { VerificationResult as VerificationResultType } from '../types';

interface VerificationResultProps {
  result: VerificationResultType;
}

export default function VerificationResult({
  result,
}: VerificationResultProps) {
  return (
    <div className="mt-4">
      <h2 className="mb-2 text-lg font-semibold">Verification Result</h2>
      <p className={result.isUnique ? 'text-green-600' : 'text-red-600'}>
        IDs are {result.isUnique ? 'unique' : 'not unique'}
      </p>
      {!result.isUnique && (
        <div className="mt-2">
          <p className="font-semibold">Duplicate IDs:</p>
          <ul className="list-inside list-disc">
            {result.duplicates.map((dup, index) => (
              <li key={index} className="text-sm text-gray-600">
                {dup}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
