import { VerificationConfig, VerificationResult } from '@/app/types';
import { compareWithSupabase } from '../supabase/supabaseComparer';
import { parseCSV } from './csvParser';
import { validateCSV, ValidationError } from './csvValidator';

export async function verifyCSV(
  file: File,
  config: VerificationConfig
): Promise<VerificationResult> {
  try {
    const csvData = await parseCSV(file);
    const validationErrors = validateCSV(csvData);
    const comparisonResult = await compareWithSupabase(csvData, config);

    return {
      ...comparisonResult,
      validationErrors,
    };
  } catch (error) {
    throw new Error(`Verification failed: ${error.message}`);
  }
}
