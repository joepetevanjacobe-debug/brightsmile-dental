interface Props {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | string
}

const map: Record<string, string> = {
  PENDING:   'badge-pending',
  CONFIRMED: 'badge-confirmed',
  COMPLETED: 'badge-completed',
  CANCELLED: 'badge-cancelled',
}

export function StatusBadge({ status }: Props) {
  return <span className={map[status] ?? 'badge bg-gray-100 text-gray-700'}>{status}</span>
}
