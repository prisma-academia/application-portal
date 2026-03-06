const CustomTable = ({ rows, onDelete }) => {
  return (
    <table className="min-w-full bg-white text-sm">
      <thead>
        <tr>
          <th className="py-1 px-1 border-b text-xs">School</th>
          <th className="py-1 px-1 border-b text-xs">Exam Type</th>
          <th className="py-1 px-1 border-b text-xs">Exam No</th>
          <th className="py-1 px-1 border-b text-xs">Year</th>
          <th className="py-1 px-1 border-b text-xs">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="py-2 px-4 border-b text-xs text-center">
              {row.school}
            </td>
            <td className="py-2 px-4 border-b text-xs text-center">
              {row.examType}
            </td>
            <td className="py-2 px-4 border-b text-xs text-center">
              {row.examNumber}
            </td>
            <td className="py-2 px-4 border-b text-xs text-center">
              {row.examYear}
            </td>
            <td className="py-2 px-4 border-b text-xs text-center">
              <button
                className="text-red-500 text-xs"
                onClick={() => onDelete(row.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomTable;
