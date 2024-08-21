import Papa from 'papaparse';
import { CSVRow } from '../../types';

export function parseCSV(file: File): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        resolve(results.data as CSVRow[]);
      },
      error: (error) => {
        reject(new Error(`Error parsing CSV: ${error.message}`));
      }
    });
  });
}