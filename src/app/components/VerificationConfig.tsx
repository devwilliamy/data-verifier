'use client';

import React, { useState, useEffect } from 'react';
import { VerificationConfig } from '../types';
import { supabase } from '../lib/supabase';

interface VerificationConfigProps {
  onConfigChange: (config: VerificationConfig) => void;
  csvHeaders: string[];
}

export default function VerificationConfig({ onConfigChange, csvHeaders }: VerificationConfigProps) {
  const [config, setConfig] = useState<VerificationConfig>({
    csvIdColumn: '',
    supabaseTable: '',
    supabaseIdColumn: '',
    columnsToCompare: []
  });
  const [supabaseTables, setSupabaseTables] = useState<string[]>([]);
  const [supabaseColumns, setSupabaseColumns] = useState<string[]>([]);

  useEffect(() => {
    fetchSupabaseTables();
  }, []);

  useEffect(() => {
    if (config.supabaseTable) {
      fetchSupabaseColumns(config.supabaseTable);
    }
  }, [config.supabaseTable]);

  useEffect(() => {
    onConfigChange(config);
  }, [config, onConfigChange]);

  async function fetchSupabaseTables() {
    const { data, error } = await supabase.from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    if (error) {
      console.error('Error fetching Supabase tables:', error);
    } else {
      setSupabaseTables(data.map(table => table.table_name));
    }
  }

  async function fetchSupabaseColumns(table: string) {
    const { data, error } = await supabase.from('information_schema.columns')
      .select('column_name')
      .eq('table_name', table)
      .eq('table_schema', 'public');
    if (error) {
      console.error('Error fetching Supabase columns:', error);
    } else {
      setSupabaseColumns(data.map(column => column.column_name));
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Verification Configuration</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CSV ID Column</label>
        <select 
          value={config.csvIdColumn}
          onChange={(e) => setConfig({...config, csvIdColumn: e.target.value})}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select CSV ID Column</option>
          {csvHeaders.map(header => (
            <option key={header} value={header}>{header}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Supabase Table</label>
        <select 
          value={config.supabaseTable}
          onChange={(e) => setConfig({...config, supabaseTable: e.target.value, supabaseIdColumn: '', columnsToCompare: []})}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select Supabase Table</option>
          {supabaseTables.map(table => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>

      {config.supabaseTable && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supabase ID Column</label>
            <select 
              value={config.supabaseIdColumn}
              onChange={(e) => setConfig({...config, supabaseIdColumn: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select Supabase ID Column</option>
              {supabaseColumns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Columns to Compare</label>
            <select 
              multiple
              value={config.columnsToCompare}
              onChange={(e) => setConfig({...config, columnsToCompare: Array.from(e.target.selectedOptions, option => option.value)})}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md h-32"
            >
              {supabaseColumns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">Hold Ctrl (Cmd on Mac) to select multiple columns</p>
          </div>
        </>
      )}
    </div>
  );
}