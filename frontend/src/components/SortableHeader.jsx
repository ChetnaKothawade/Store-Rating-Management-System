export default function SortableHeader({ label, field, sortBy, order, onSort }) {
  const active = sortBy === field;
  const icon = active ? (order === 'ASC' ? ' ↑' : ' ↓') : '';

  return (
    <th
      role="button"
      className="user-select-none"
      onClick={() => onSort(field)}
      style={{ cursor: 'pointer' }}
    >
      {label}
      {icon}
    </th>
  );
}
