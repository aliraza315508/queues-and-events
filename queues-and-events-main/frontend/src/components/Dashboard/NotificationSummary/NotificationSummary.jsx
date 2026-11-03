import './NotificationSummary.css'

const notifications = [
  { status: 'SENT', count: 18, style: 'success' },
  { status: 'QUEUED', count: 2, style: 'neutral' },
  { status: 'PENDING', count: 1, style: 'warning' },
  { status: 'FAILED', count: 1, style: 'danger' },
]

export default function NotificationSummary() {
  return (
    <section className="notification-summary">
      <h2>Notifications</h2>

      <div className="notification-summary-grid">
        {notifications.map((item) => (
          <article
            key={item.status}
            className={`notification-stat notification-stat-${item.style}`}
          >
            <h3>{item.status}</h3>
            <p>{item.count}</p>
          </article>
        ))}
      </div>
    </section>
  )
}