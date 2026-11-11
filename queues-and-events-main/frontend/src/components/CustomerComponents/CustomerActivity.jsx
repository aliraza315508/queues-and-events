
import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'

import { getOrdersByCustomerId } from '../../api/orderApi'
import { getPaymentsByCustomerId } from '../../api/paymentApi'
import { getNotificationsByCustomerId } from '../../api/notificationApi'

import StatusBadge from '../ReueseableServiceTemplate/StatusBadge'

// Available account tabs.
const tabs = ['orders', 'payments', 'notifications']

// Format amounts as USD.
function formatAmount(value) {
  if (value == null) return 'Not provided'

  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

// Format timestamps.
function formatDate(value) {
  if (!value) return 'Not provided'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? 'Not provided'
    : date.toLocaleString()
}

// Display one customer record.
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
  // Only the selected tab needs local state.
  const [accountTab, setAccountTab] = useState('orders')

  // TanStack Query handles all API request states.
  const [ordersQuery, paymentsQuery, notificationsQuery] = useQueries({
    queries: [
      {
        queryKey: ['customer', customerId, 'orders'],
        queryFn: ({ signal }) =>
          getOrdersByCustomerId(customerId, signal),
        enabled: Boolean(customerId),
      },
      {
        queryKey: ['customer', customerId, 'payments'],
        queryFn: ({ signal }) =>
          getPaymentsByCustomerId(customerId, signal),
        enabled: Boolean(customerId),
      },
      {
        queryKey: ['customer', customerId, 'notifications'],
        queryFn: ({ signal }) =>
          getNotificationsByCustomerId(customerId, signal),
        enabled: Boolean(customerId),
      },
    ],
  })

  // Associate each tab with its query.
  const queries = {
    orders: ordersQuery,
    payments: paymentsQuery,
    notifications: notificationsQuery,
  }

  const currentQuery = queries[accountTab]

  // Copy and sort records without changing cached data.
  const currentRecords = Array.isArray(currentQuery.data)
    ? [...currentQuery.data].sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      )
    : []

  return (
    <section className="customer-activity">

      {/* Customer account tabs */}
      <nav
        className="account-tabs"
        aria-label="Customer records"
      >
        {tabs.map((tab) => {
          const query = queries[tab]

          return (
            <button
              key={tab}
              type="button"
              className={accountTab === tab ? 'active' : ''}
              aria-pressed={accountTab === tab}
              onClick={() => setAccountTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}

              {query.isSuccess &&
                Array.isArray(query.data) &&
                ` (${query.data.length})`}
            </button>
          )
        })}
      </nav>

      {/* Display selected tab records */}
      <div
        className="account-tab-content"
        aria-live="polite"
      >
        {currentQuery.isPending ? (
          <p role="status">
            Loading customer {accountTab}...
          </p>
        ) : currentQuery.isError && !currentQuery.data ? (
          <p role="alert">
            {currentQuery.error?.message ||
              `Could not load customer ${accountTab}.`}
          </p>
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
