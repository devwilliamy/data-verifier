import { verifyCSV } from '../src/lib/csvVerifier';

describe('csvVerifier', () => {
  it('should correctly identify unique IDs', async () => {
    const csvContent = `id,name
1,John
2,Jane
3,Bob`;
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await verifyCSV(file);
    
    expect(result.isUnique).toBe(true);
    expect(result.duplicates).toHaveLength(0);
  });

  it('should correctly identify duplicate IDs', async () => {
    const csvContent = `id,name
1,John
2,Jane
1,Bob`;
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await verifyCSV(file);
    
    expect(result.isUnique).toBe(false);
    expect(result.duplicates).toHaveLength(1);
    expect(result.duplicates[0]).toBe('Row 3: 1');
  });
});