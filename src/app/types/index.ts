export interface VerificationResult {
    isUnique: boolean;
    duplicates: string[];
  }
  
  export interface CSVRow {
    [key: string]: string;
  }