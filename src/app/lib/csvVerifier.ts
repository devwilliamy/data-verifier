import Papa from 'papaparse';
import { VerificationResult, CSVRow } from '../types';
import { supabase } from './supabase';

export async function verifyCSV(file: File, tableName: string): Promise<VerificationResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const idSet = new Set();
        const duplicates: string[] = [];
        const supabaseDuplicates: string[] = [];
        let isUnique = true;

        for (const [index, row] of results.data.entries()) {
          const id = (row as CSVRow).id;
          if (idSet.has(id)) {
            isUnique = false;
            duplicates.push(`Row ${index + 2}: ${id}`);
          } else {
            idSet.add(id);
          }

          // Check against Supabase
          const { data, error } = await supabase
            .from(tableName)
            .select('id')
            .eq('id', id)
            .single();

          if (error && error.code !== 'PGRST116') {
            reject(new Error(`Supabase error: ${error.message}`));
            return;
          }

          if (data) {
            isUnique = false;
            supabaseDuplicates.push(`Row ${index + 2}: ${id}`);
          }
        }

        resolve({ isUnique, duplicates, supabaseDuplicates });
      },
      error: (error) => {
        reject(new Error(`Error parsing CSV: ${error.message}`));
      }
    });
  });
}