import Papa from 'papaparse';
import { VerificationResult, CSVRow, VerificationConfig } from '../types';
import { supabase } from './supabase';

export async function verifyCSV(file: File, config: VerificationConfig): Promise<VerificationResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const csvData = results.data as CSVRow[];
        const matches: VerificationResult['matches'] = [];
        const unmatchedCSVRows: string[] = [];
        const csvIds = new Set<string>();

        for (const [index, row] of csvData.entries()) {
          const csvId = row[config.csvIdColumn];
          csvIds.add(csvId);

          const { data: supabaseRow, error } = await supabase
            .from(config.supabaseTable)
            .select(config.columnsToCompare.join(','))
            .eq(config.supabaseIdColumn, csvId)
            .single();

          if (error && error.code !== 'PGRST116') {
            reject(new Error(`Supabase error: ${error.message}`));
            return;
          }

          if (supabaseRow) {
            const differences: MatchResult['differences'] = {};
            for (const column of config.columnsToCompare) {
              if (row[column] !== supabaseRow[column]) {
                differences[column] = {
                  csv: row[column],
                  supabase: supabaseRow[column]
                };
              }
            }
            if (Object.keys(differences).length > 0) {
              matches.push({ id: csvId, csvRow: index + 2, differences });
            }
          } else {
            unmatchedCSVRows.push(`Row ${index + 2}: ${csvId}`);
          }
        }

        // Find unmatched Supabase IDs
        const { data: allSupabaseIds, error: supabaseError } = await supabase
          .from(config.supabaseTable)
          .select(config.supabaseIdColumn);

        if (supabaseError) {
          reject(new Error(`Supabase error: ${supabaseError.message}`));
          return;
        }

        const unmatchedSupabaseIds = allSupabaseIds
          .filter(row => !csvIds.has(row[config.supabaseIdColumn]))
          .map(row => row[config.supabaseIdColumn]);

        resolve({ matches, unmatchedCSVRows, unmatchedSupabaseIds });
      },
      error: (error) => {
        reject(new Error(`Error parsing CSV: ${error.message}`));
      }
    });
  });
}