import { CSVRow } from '../../types';

export interface ValidationError {
  row: number;
  message: string;
}

export function validateCSV(csvData: CSVRow[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const uniqueSkus = new Set<string>();
  const uniqueIds = new Set<string>();

  csvData.forEach((row, index) => {
    const rowNumber = index + 2; // accounting for header row and 0-based index

    // Validate preorder rule
    if (row.preorder === 'TRUE' && (!row.preorder_discount || !row.preorder_date)) {
      errors.push({
        row: rowNumber,
        message: 'If preorder is TRUE, preorder_discount and preorder_date must have values'
      });
    }

    // Check for unique SKU
    if (uniqueSkus.has(row.sku)) {
      errors.push({
        row: rowNumber,
        message: 'SKU must be unique for all rows'
      });
    } else {
      uniqueSkus.add(row.sku);
    }

    // Check for unique ID
    if (uniqueIds.has(row.id)) {
      errors.push({
        row: rowNumber,
        message: 'ID must be unique for all rows'
      });
    } else {
      uniqueIds.add(row.id);
    }

    // Add more validation rules here as needed
  });

  return errors;
}