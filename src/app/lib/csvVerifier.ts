import Papa from 'papaparse';
import { VerificationResult, CSVRow } from '../types';

export async function verifyCSV(file: File): Promise<VerificationResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const idSet = new Set();
        const duplicates: string[] = [];
        let isUnique = true;

        results.data.forEach((row: CSVRow, index: number) => {
          const id = row.id; // Assuming 'id' is the column name
          if (idSet.has(id)) {
            isUnique = false;
            duplicates.push(`Row ${index + 2}: ${id}`); // +2 because of 0-indexing and header row
          } else {
            idSet.add(id);
          }
        });

        resolve({ isUnique, duplicates });
      },
      error: (error) => {
        reject(new Error(`Error parsing CSV: ${error.message}`));
      }
    });
  });
}