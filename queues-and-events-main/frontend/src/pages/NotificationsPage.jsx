import { useEffect, useState } from 'react'
import { getNotifications } from '../api/notificationApi'
import NotificationCard from '../components/NotificationCard'
import './css/NotificationsPage.css'

export default function NotificationsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const data = await getNotifications(controller.signal)
        if (!controller.signal.aborted) setItems(data)
      } catch (error) {
        if (!controller.signal.aborted) setError(error.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadItems()
    return () => controller.abort()
  }, [])

  return (
    <section id="notification" className="notification-page" aria-labelledby="notification-heading">
      <h2 id="notification-heading">Notifications</h2>
      {loading && <p role="status">Loading notifications...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No notifications found.</p>}
      <div className="notification-grid">
        {items.map((item) => <NotificationCard key={item.id} notification={item} />)}
      </div>
    </section>
  )
}
