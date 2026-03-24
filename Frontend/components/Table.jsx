export default function Table({ columns, data, actions }) {
  return (
    <div className="w-full overflow-auto rounded-xl border border-zinc-200 bg-white">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b border-zinc-200 bg-zinc-50/50">
          <tr className="border-b transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100">
            {columns.map((col, i) => (
              <th key={i} className="h-12 px-4 text-left align-middle font-medium text-zinc-500">
                {col.header}
              </th>
            ))}
            {actions && <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500">Actions</th>}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-zinc-200 transition-colors hover:bg-zinc-50/50">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-4 align-middle text-zinc-800">
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
              {actions && (
                <td className="p-4 align-middle">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
