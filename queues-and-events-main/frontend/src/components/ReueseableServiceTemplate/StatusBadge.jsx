export default function StatusBadge({ status }) {
  // Choose the badge color from the record's status.
  const successStatuses = [
    'CONFIRMED',
    'COMPLETED',
    'SENT',
    'IN_STOCK',
  ]

  const failedStatuses = [
    'FAILED',
    'PAYMENT_FAILED',
    'CANCELLED',
    'INVENTORY_REJECTED',
    'OUT_OF_STOCK',
  ]

  const normalizedStatus = String(status ?? '').toUpperCase()

  const tone = successStatuses.includes(normalizedStatus)
    ? 'success'
    : failedStatuses.includes(normalizedStatus)
      ? 'danger'
      : 'warning'

  // Convert PAYMENT_FAILED into "Payment failed".
  const text = normalizedStatus
    ? normalizedStatus
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/^./, (letter) => letter.toUpperCase())
    : 'Not provided'

  return (
    <span className={`service-badge service-badge--${tone}`}>
      {text}
    </span>
  )
}