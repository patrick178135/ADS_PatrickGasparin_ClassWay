import React from 'react';

interface TableProps {
  data: any[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  if (!data.length) return <p>Nenhum registro encontrado.</p>;

  const headers = Object.keys(data[0]);

  return (
    <table className="min-w-full border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((header) => (
            <th key={header} className="border px-4 py-2">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            {headers.map((header) => (
              <td key={header} className="border px-4 py-2">{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
