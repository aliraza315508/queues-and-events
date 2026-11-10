
import './OrderOverview.css'
import { useEffect, useState } from 'react'

import { getOrders } from '../../../api/orderApi'
import { getPayments } from '../../../api/paymentApi'
import { getInventory } from '../../../api/inventoryApi'
import { getNotifications } from '../../../api/notificationApi'

const LOW_STOCK_THRESHOLD = 10

export default function OrderOverview() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadEvents() {
      try {
        const [orders, payments, inventory, notifications] =
          await Promise.all([
            getOrders(controller.signal),
            getPayments(controller.signal),
            getInventory(controller.signal),
            getNotifications(controller.signal),
          ])

        const countStatus = (items, status) =>
          items.filter((item) => item.status === status).length

        const result = [
          {
            title: 'Orders',
            events: [
              { label: 'TOTAL_CREATED', count: orders.length },
              { label: 'CONFIRMED', count: countStatus(orders, 'CONFIRMED') },
              { label: 'CANCELLED', count: countStatus(orders, 'CANCELLED') },
            ],
          },
          {
            title: 'Payments',
            events: [
              { label: 'PAYMENT_COMPLETED', count: countStatus(payments, 'COMPLETED') },
              { label: 'PAYMENT_FAILED', count: countStatus(payments, 'FAILED') },
            ],
          },
          {
            title: 'Inventory',
            events: [
              {
                label: 'RESERVED_UNITS',
                count: inventory.reduce(
                  (sum, item) => sum + Number(item.reservedQuantity ?? 0),
                  0
                ),
              },
              {
                label: 'LOW_STOCK',
                count: inventory.filter(
                  (item) =>
                    Number(item.availableQuantity) <= LOW_STOCK_THRESHOLD
                ).length,
              },
              {
                label: 'OUT_OF_STOCK',
                count: inventory.filter(
                  (item) => Number(item.availableQuantity) === 0
                ).length,
              },
            ],
          },
          {
            title: 'Notifications',
            events: [
              { label: 'SENT', count: countStatus(notifications, 'SENT') },
              { label: 'FAILED', count: countStatus(notifications, 'FAILED') },
              { label: 'QUEUED', count: countStatus(notifications, 'QUEUED') },
              { label: 'PENDING', count: countStatus(notifications, 'PENDING') },
            ],
          },
        ]

        if (!controller.signal.aborted) {
          setGroups(result)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || 'Failed to fetch overview')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadEvents()

    return () => controller.abort()
  }, [])

  const largestCount = Math.max(
    1,
    ...groups.flatMap((group) =>
      group.events.map((event) => event.count)
    )
  )

  const scaleMaximum = largestCount * 1.2

  return (
    <section className="order-overview">
      <h2>Events Overview</h2>

      {loading && <p>Loading activity...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && groups.map((group) => (
        <div className="event-overview-group" key={group.title}>
          <h3>{group.title}</h3>

          <div className="order-status-list">
            {group.events.map((event) => (
              <div className="order-status-row" key={event.label}>
                <span className="order-status-label">
                  {event.label}
                </span>

                <div className="order-status-track" aria-hidden="true">
                  <div
                    className="order-status-fill"
                    style={{
                      width: `${(event.count / scaleMaximum) * 100}%`,
                      background: 'var(--color-order-confirmed)',
                    }}
                  />
                </div>

                <span className="order-status-count">
                  {event.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!loading && !error && (
        <p className="event-overview-note">
          Current database activity and statuses.
          Reserved units represent stock, not Kafka event counts.
        </p>
      )}
    </section>
  )
}
