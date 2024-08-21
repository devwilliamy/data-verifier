'use client';

import React, { useState, useEffect } from 'react';
import { VerificationConfig } from '../types';
import { supabase } from '../lib/supabase/supabase';

interface VerificationConfigProps {
  onConfigChange: (config: VerificationConfig) => void;
  csvHeaders: string[];
}

export default function VerificationConfig({
  onConfigChange,
  csvHeaders,
}: VerificationConfigProps) {
  const [config, setConfig] = useState<VerificationConfig>({
    csvIdColumn: '',
    supabaseTable: '',
    supabaseIdColumn: '',
    columnsToCompare: [],
  });
  const [supabaseTables, setSupabaseTables] = useState<string[]>([]);
  const [supabaseColumns, setSupabaseColumns] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
    setFetchError(null);
    try {
      const { data, error } = await supabase.rpc('get_public_tables');

      if (error) {
        throw error;
      }

      if (data) {
        // Extract table names from the returned objects
        const tableNames = data.map(
          (item: { table_name: string }) => item.table_name
        );
        setSupabaseTables(tableNames);
        console.log('Fetched tables:', tableNames);
      } else {
        setSupabaseTables([]);
        console.log('No tables found');
      }
    } catch (error) {
      console.error('Error fetching Supabase tables:', error);
      setFetchError(
        'Failed to fetch Supabase tables. Please check your connection and permissions.'
      );
    }
  }

  async function fetchSupabaseColumns(table: string) {
    setFetchError(null);
    try {
      const { data, error } = await supabase.rpc('get_table_columns', {
        p_table_name: table,
      });

      if (error) {
        throw error;
      }

      if (data) {
        // Extract column names from the returned objects
        const columnNames = data.map(
          (item: { column_name: string }) => item.column_name
        );
        setSupabaseColumns(columnNames);
        console.log('Fetched columns:', columnNames);
      } else {
        setSupabaseColumns([]);
        console.log('No columns found');
      }
    } catch (error) {
      console.error('Error fetching Supabase columns:', error);
      setFetchError(
        'Failed to fetch Supabase columns. Please check your table name and permissions.'
      );
    }
  }

  const selectClassName =
    'mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-gray-900';

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        Verification Configuration
      </h2>
      {fetchError && (
        <div
          className="rounded border-l-4 border-red-500 bg-red-100 p-4 text-red-700"
          role="alert"
        >
          <p>{fetchError}</p>
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          CSV ID Column
        </label>
        <select
          value={config.csvIdColumn}
          onChange={(e) =>
            setConfig({ ...config, csvIdColumn: e.target.value })
          }
          className={selectClassName}
        >
          <option value="">Select CSV ID Column</option>
          {csvHeaders.map((header) => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Supabase Table
        </label>
        <select
          value={config.supabaseTable}
          onChange={(e) =>
            setConfig({
              ...config,
              supabaseTable: e.target.value,
              supabaseIdColumn: '',
              columnsToCompare: [],
            })
          }
          className={selectClassName}
        >
          <option value="">Select Supabase Table</option>
          {supabaseTables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {config.supabaseTable && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Supabase ID Column
            </label>
            <select
              value={config.supabaseIdColumn}
              onChange={(e) =>
                setConfig({ ...config, supabaseIdColumn: e.target.value })
              }
              className={selectClassName}
            >
              <option value="">Select Supabase ID Column</option>
              {supabaseColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Columns to Compare
            </label>
            <select
              multiple
              value={config.columnsToCompare}
              onChange={(e) =>
                setConfig({
                  ...config,
                  columnsToCompare: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
              className={`${selectClassName} h-32`}
            >
              {supabaseColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Hold Ctrl (Cmd on Mac) to select multiple columns
            </p>
          </div>
        </>
      )}
    </div>
  );
}
