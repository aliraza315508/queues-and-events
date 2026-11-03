import './OrderOverview.css'

const orderStatuses = [
  { status: 'CREATED', count: 4 },
  { status: 'INVENTORY_RESERVED', count: 6 },
  { status: 'INVENTORY_REJECTED', count: 1 },
  { status: 'PAYMENT_COMPLETED', count: 5 },
  { status: 'PAYMENT_FAILED', count: 1 },
  { status: 'CONFIRMED', count: 6 },
  { status: 'CANCELLED', count: 1 },
]

export default function OrderOverview() {
  const totalOrders = orderStatuses.reduce(
    (total, item) => total + item.count,
    0
  )

  return (
    <section className="order-overview">
      <h2>Order overview</h2>
      <p>Current status of all orders</p>

      <div className="order-status-list">
        {orderStatuses.map((item) => (
          <div className="order-status-row" key={item.status}>
            <span className="order-status-label">
              {item.status.replaceAll('_', ' ')}
            </span>

            <div className="order-status-track" aria-hidden="true">
              <div
                className="order-status-fill"
                style={{
                  width: `${
                    totalOrders === 0
                      ? 0
                      : (item.count / totalOrders) * 100
                  }%`,
                }}
              />
            </div>

            <strong>{item.count}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}