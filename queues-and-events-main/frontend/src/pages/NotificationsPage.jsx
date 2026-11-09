import { useEffect, useState } from 'react'
import { getNotifications } from '../api/notificationApi'
import ServicePage from '../components/ReueseableServiceTemplate/ServicePage'
import StatusBadge from '../components/ReueseableServiceTemplate/StatusBadge'
import './css/NotificationsPage.css'

const summaryCards = [
  {
    label: 'Sent',
    status: 'SENT',
    iconPath: 'm22 2-7 20-4-9-9-4 20-7ZM22 2 11 13',
  },
  {
    label: 'Pending',
    status: 'PENDING',
    iconPath: 'M22 12a10 10 0 1 1-20 0 10 10 0 1 1 20 0ZM12 6v6l4 2',
  },
  {
    label: 'Failed',
    status: 'FAILED',
    iconPath: 'M22 12a10 10 0 1 1-20 0 10 10 0 1 1 20 0ZM9 9l6 6m0-6-6 6',
  },
]

const updatedDateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function formatType(type) {
  return type
    ? type.toLowerCase().replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase())
    : '—'
}

function formatUpdatedAt(value) {
  const date = new Date(value)
  return value && !Number.isNaN(date.getTime())
    ? updatedDateFormat.format(date)
    : '—'
}

const columns = [
  { key: 'recipientEmail', label: 'Recipient' },
  { key: 'subject', label: 'Subject' },
  {
    key: 'notificationType',
    label: 'Type',
    render: (item) => formatType(item.notificationType),
  },
  { key: 'orderId', label: 'Order ID' },
  {
    key: 'status',
    label: 'Status',
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: 'updatedAt',
    label: 'Updated',
    render: (item) => formatUpdatedAt(item.updatedAt),
  },
]

function MessagePreview({ notification }) {
  return (
    <>
      <dl className="notification-preview-meta">
        <div>
          <dt>Recipient</dt>
          <dd>{notification.recipientEmail ?? '—'}</dd>
        </div>
        <div>
          <dt>Subject</dt>
          <dd>{notification.subject ?? '—'}</dd>
        </div>
      </dl>

      <p className="notification-preview-message">
        {notification.message || 'No message body available.'}
      </p>
    </>
  )
}

export default function NotificationsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

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

  const query = search.trim().toLowerCase()
  const types = [...new Set(items.map((item) => item.notificationType).filter(Boolean))].sort()

  const filteredItems = items.filter((item) => {
    const recipient = (item.recipientEmail ?? '').toLowerCase()
    const subject = (item.subject ?? '').toLowerCase()
    const matchesSearch = recipient.includes(query) || subject.includes(query)
    const matchesType = !type || item.notificationType === type

    return matchesSearch && matchesType
  })

  const summaries = summaryCards.map(({ label, status, iconPath }) => ({
    label,
    value: items.filter((item) => item.status === status).length,
    icon: (
      <svg
        className={`notification-summary-icon--${status.toLowerCase()}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={iconPath} />
      </svg>
    ),
  }))

  return (
    <ServicePage
      title="Notifications"
      description="View messages sent to customers about their orders and related events."
      summaries={loading || error ? [] : summaries}
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by recipient or subject..."
      filters={
        <label className="service-filter">
          Type
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="">All types</option>
            {types.map((value) => (
              <option key={value} value={value}>
                {formatType(value)}
              </option>
            ))}
          </select>
        </label>
      }
      columns={columns}
      items={filteredItems}
      detailsTitle="Message preview"
      renderDetails={(notification) => <MessagePreview notification={notification} />}
      loading={loading}
      error={error}
      emptyMessage={items.length ? 'No notifications match your filters.' : 'No notifications found.'}
    />
  )
}