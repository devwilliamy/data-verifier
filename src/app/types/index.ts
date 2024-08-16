export interface VerificationResult {
    matches: MatchResult[];
    unmatchedCSVRows: string[];
    unmatchedSupabaseIds: string[];
  }
  
  export interface MatchResult {
    id: string;
    csvRow: number;
    differences: {
      [column: string]: {
        csv: string;
        supabase: string;
      }
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