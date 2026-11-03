import './OrderOverview.css'

// Sample counts until the dashboard is connected to the API.
const orderStatuses = [
  { status: 'CREATED', count: 4, style: 'created' },
  { status: 'INVENTORY_RESERVED', count: 6, style: 'reserved' },
  { status: 'INVENTORY_REJECTED', count: 1, style: 'default' },
  { status: 'PAYMENT_COMPLETED', count: 5, style: 'payment' },
  { status: 'PAYMENT_FAILED', count: 1, style: 'default' },
  { status: 'CONFIRMED', count: 6, style: 'confirmed' },
  { status: 'CANCELLED', count: 1, style: 'default' },
]

export default function OrderOverview() {
  // Scale against the largest count, leaving room after the longest bar.
  const largestCount = Math.max(
    1,
    ...orderStatuses.map((item) => item.count)
  )
  const scaleMaximum = largestCount * 1.2

  return (
    <section className="order-overview">
      <h2>Order overview</h2>

      <div className="order-status-list">
        {orderStatuses.map((item) => (
          <div className="order-status-row" key={item.status}>
            {/* Preserve underscores to match the reference. */}
            <span className="order-status-label">
              {item.status}
            </span>

            {/* Decorative bar; the count is shown as text beside it. */}
            <div className="order-status-track" aria-hidden="true">
              <div
                className={`order-status-fill order-status-fill--${item.style}`}
                style={{
                  width: `${(item.count / scaleMaximum) * 100}%`,
                }}
              />
            </div>

            <span className="order-status-count">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}