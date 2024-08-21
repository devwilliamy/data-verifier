import { supabase } from './supabase';
import { CSVRow, VerificationConfig } from '../types';

export interface ComparisonResult {
  matches: Array<{
    id: string;
    csvRow: number;
    differences: {
      [column: string]: {
        csv: string;
        supabase: string;
      };
    };
  }>;
  unmatchedCSVRows: string[];
  unmatchedSupabaseIds: string[];
}

export async function compareWithSupabase(csvData: CSVRow[], config: VerificationConfig): Promise<ComparisonResult> {
  const matches: ComparisonResult['matches'] = [];
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
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (supabaseRow) {
      const differences: ComparisonResult['matches'][0]['differences'] = {};
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

  const { data: allSupabaseIds, error: supabaseError } = await supabase
    .from(config.supabaseTable)
    .select(config.supabaseIdColumn);

  if (supabaseError) {
    throw new Error(`Supabase error: ${supabaseError.message}`);
  }

  const unmatchedSupabaseIds = allSupabaseIds
    .filter(row => !csvIds.has(row[config.supabaseIdColumn]))
    .map(row => row[config.supabaseIdColumn]);

  return { matches, unmatchedCSVRows, unmatchedSupabaseIds };
}