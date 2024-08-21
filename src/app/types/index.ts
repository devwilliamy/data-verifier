import { ValidationError } from '../lib/csvHelpers/csvValidator';
import { ComparisonResult } from '../lib/supabase/supabaseComparer';

export interface VerificationResult extends ComparisonResult {
  validationErrors: ValidationError[];
}

export interface MatchResult {
  id: string;
  csvRow: number;
  differences: {
    [column: string]: {
      csv: string;
      supabase: string;
    };
  };
}

export interface CSVRow {
  [key: string]: string;
}

export interface VerificationConfig {
  csvIdColumn: string;
  supabaseTable: string;
  supabaseIdColumn: string;
  columnsToCompare: string[];
}
