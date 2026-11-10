
import { useEffect, useState } from 'react'

import { getOrdersByCustomerId } from '../../api/orderApi'
import { getPaymentsByCustomerId } from '../../api/paymentApi'
import { getNotificationsByCustomerId } from '../../api/notificationApi'

import StatusBadge from '../ReueseableServiceTemplate/StatusBadge'

// Available account tabs.
const tabs = ['orders', 'payments', 'notifications']

const emptyRecords = () => ({
  orders: [],
  payments: [],
  notifications: [],
})

const emptyErrors = () => ({
  orders: '',
  payments: '',
  notifications: '',
})

// Format monetary values.
function formatAmount(value) {
  if (value == null) return 'Not provided'

  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

// Format timestamps from the backend.
function formatDate(value) {
  if (!value) return 'Not provided'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? 'Not provided'
    : date.toLocaleString()
}

// Render a single customer record.
function AccountRecord({ type, record }) {
  let title = ''
  let fields = []

  if (type === 'orders') {
    title = `Order ${String(record.id ?? '').slice(0, 8)}`

    fields = [
      ['Order ID', record.id],
      ['Product ID', record.productId],
      ['Quantity', record.quantity],
      ['Unit Price', formatAmount(record.unitPrice)],
      ['Total Amount', formatAmount(record.totalAmount)],
      ['Created', formatDate(record.createdAt)],
    ]
  }

  if (type === 'payments') {
    title = `Payment ${String(record.id ?? '').slice(0, 8)}`

    fields = [
      ['Payment ID', record.id],
      ['Order ID', record.orderId],
      ['Amount', formatAmount(record.amount)],
      ['Method', record.paymentMethod],
      ['Created', formatDate(record.createdAt)],
    ]
  }

  if (type === 'notifications') {
    title = record.subject || 'Notification'

    fields = [
      ['Notification ID', record.id],
      ['Order ID', record.orderId],
      ['Type', record.notificationType],
      ['Message', record.message],
      ['Created', formatDate(record.createdAt)],
    ]
  }

  return (
    <li className="account-record">
      <div className="account-record-header">
        <strong>{title}</strong>
        <StatusBadge status={record.status} />
      </div>

      <dl className="account-record-details">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value ?? 'Not provided'}</dd>
          </div>
        ))}
      </dl>
    </li>
  )
}

export default function CustomerActivity({ customerId }) {
  const [accountTab, setAccountTab] = useState('orders')

  const [records, setRecords] = useState(emptyRecords)
  const [errors, setErrors] = useState(emptyErrors)
  const [loading, setLoading] = useState(true)

  // Load records whenever the selected customer changes.
  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setRecords(emptyRecords())
    setErrors(emptyErrors())

    async function loadCustomerActivity() {
      // Fetch all three collections concurrently.
      const results = await Promise.allSettled([
        getOrdersByCustomerId(customerId, controller.signal),
        getPaymentsByCustomerId(customerId, controller.signal),
        getNotificationsByCustomerId(customerId, controller.signal),
      ])

      // Ignore outdated responses.
      if (controller.signal.aborted) return

      const nextRecords = emptyRecords()
      const nextErrors = emptyErrors()

      results.forEach((result, index) => {
        const type = tabs[index]

        if (
          result.status === 'fulfilled' &&
          Array.isArray(result.value)
        ) {
          nextRecords[type] = [...result.value].sort(
            (a, b) =>
              new Date(b.createdAt || 0) -
              new Date(a.createdAt || 0)
          )
        } else {
          nextErrors[type] =
            result.status === 'rejected'
              ? result.reason?.message || `Could not load ${type}.`
              : `Invalid response from ${type} service.`
        }
      })

      setRecords(nextRecords)
      setErrors(nextErrors)
      setLoading(false)
    }

    loadCustomerActivity()

    // Cancel requests if the component unmounts
    // or a different customer is selected.
    return () => controller.abort()
  }, [customerId])

  const currentRecords = records[accountTab]
  const currentError = errors[accountTab]

  return (
    <section className="customer-activity">
      {/* Orders, Payments, Notifications tabs */}
      <nav
        className="account-tabs"
        aria-label="Customer records"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={accountTab === tab ? 'active' : ''}
            aria-pressed={accountTab === tab}
            onClick={() => setAccountTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}

            {!loading &&
              !errors[tab] &&
              ` (${records[tab].length})`}
          </button>
        ))}
      </nav>

      {/* Display selected tab's records */}
      <div
        className="account-tab-content"
        aria-live="polite"
      >
        {loading ? (
          <p role="status">
            Loading customer {accountTab}...
          </p>
        ) : currentError ? (
          <p role="alert">{currentError}</p>
        ) : currentRecords.length === 0 ? (
          <p>No {accountTab} found for this customer.</p>
        ) : (
          <ul className="account-record-list">
            {currentRecords.map((record) => (
              <AccountRecord
                key={record.id}
                type={accountTab}
                record={record}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
