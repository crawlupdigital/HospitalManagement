import React from 'react';

const DataTable = ({ columns, data, isLoading, emptyMessage = 'No data available' }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap text-sm text-left align-middle text-gray-700">
          <thead className="bg-[#F1F3F4]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="p-4 font-semibold text-gray-900 border-b border-gray-200"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-blue-50/50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="p-4">
                      {col.cell ? col.cell(row) : row[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
