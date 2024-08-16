'use client';

import React from 'react';

interface TableNameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export default function TableNameInput({ value, onChange, disabled }: TableNameInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor="table-name" className="block text-sm font-medium text-gray-700 mb-2">
        Supabase Table Name
      </label>
      <input
        type="text"
        id="table-name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder="Enter table name"
      />
    </div>
  );
}