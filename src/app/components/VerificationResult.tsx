import React from 'react';
import { VerificationResult as VerificationResultType } from '../types';

interface VerificationResultProps {
  result: VerificationResultType;
}

export default function VerificationResult({ result }: VerificationResultProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Verification Result</h2>
      
      {result.matches.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Matched Rows with Differences</h3>
          {result.matches.map((match, index) => (
            <div key={index} className="bg-yellow-100 p-3 rounded mb-2">
              <p className="font-medium">ID: {match.id} (CSV Row: {match.csvRow})</p>
              <ul className="list-disc list-inside">
                {Object.entries(match.differences).map(([column, values]) => (
                  <li key={column}>
                    {column}: CSV: {values.csv}, Supabase: {values.supabase}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      
      {result.unmatchedCSVRows.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Unmatched CSV Rows</h3>
          <ul className="list-disc list-inside">
            {result.unmatchedCSVRows.map((row, index) => (
              <li key={index}>{row}</li>
            ))}
          </ul>
        </div>
      )}
      
      {result.unmatchedSupabaseIds.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Unmatched Supabase IDs</h3>
          <ul className="list-disc list-inside">
            {result.unmatchedSupabaseIds.map((id, index) => (
              <li key={index}>{id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}