import { useEffect, useState } from 'react'
import { getNotifications } from '../../../api/notificationApi'
import './NotificationSummary.css'

// ========================================
// 1. NOTIFICATION STATUSES
// ========================================

const notificationStatuses = [
  { status: 'SENT', style: 'sent' },
  { status: 'QUEUED', style: 'queued' },
  { status: 'PENDING', style: 'pending' },
  { status: 'FAILED', style: 'failed' }
]

// ========================================
// 2. NOTIFICATION SUMMARY COMPONENT
// ========================================

export default function NotificationSummary() {

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ========================================
  // 3. FETCH NOTIFICATIONS FROM BACKEND
  // ========================================

  useEffect(() => {
    const controller = new AbortController()

    async function loadNotifications() {
      try {
        setLoading(true)
        setError('')

        const data = await getNotifications(controller.signal)

        if (!controller.signal.aborted) {
          if (!Array.isArray(data)) {
            throw new Error('Invalid notifications response')
          }

          setNotifications(data)
        }

      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.message)
        }

      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadNotifications()

    return () => controller.abort()
  }, [])

  // ========================================
  // 4. CALCULATE STATUS COUNTS
  // ========================================

  const summaries = notificationStatuses.map((item) => ({
    ...item,
    count: notifications.filter(
      (notification) => notification.status === item.status
    ).length
  }))

  // ========================================
  // 5. RENDER NOTIFICATION SUMMARY
  // ========================================

  return (
    <section className="notification-summary">

      <h2>Notifications</h2>

      {loading && <p role="status">Loading notifications...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <div className="notification-summary-grid">

          {summaries.map((item) => (
            <article
              key={item.status}
              className={`notification-stat notification-stat--${item.style}`}
            >
              <h3>{item.status}</h3>
              <p>{item.count}</p>
            </article>
          ))}

        </div>
      )}

    </section>
    )

}