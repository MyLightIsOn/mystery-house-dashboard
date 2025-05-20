import React from "react";

interface DataTableProps {
  columns: string[];
  rows: (string | number)[][];
}

const DataTable: React.FC<DataTableProps> = ({ columns, rows }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="p-2 border-b text-left font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="odd:bg-white even:bg-gray-50">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-2 border-b">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
