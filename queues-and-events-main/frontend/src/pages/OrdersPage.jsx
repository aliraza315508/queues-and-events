import { useEffect, useState } from 'react'
import { getOrders } from '../api/orderApi'
import ServicePage from '../components/ReueseableServiceTemplate/ServicePage'
import StatusBadge from '../components/ReueseableServiceTemplate/StatusBadge'
import SummaryIcon from '../components/ReueseableServiceTemplate/SummaryIcon'
import './css/OrdersPage.css'

// Status values used by the backend.
const statuses = [
  'CREATED',
  'INVENTORY_RESERVED',
  'INVENTORY_REJECTED',
  'PAYMENT_COMPLETED',
  'PAYMENT_FAILED',
  'CONFIRMED',
  'CANCELLED',
]

// Display amounts with two decimal places.
function formatAmount(value) {
  if (value == null || value === '') return 'Not provided'

  const amount = Number(value)

  return Number.isFinite(amount)
    ? amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : 'Not provided'
}

// Display timestamps in the user's local timezone.
function formatDate(value) {
  if (!value) return 'Not provided'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? 'Not provided'
    : date.toLocaleString()
}

// Table columns passed to the shared template.
const columns = [
  {
    key: 'id',
    label: 'Order ID',
  },
  {
    key: 'customerId',
    label: 'Customer ID',
  },
  {
    key: 'productId',
    label: 'Product ID',
  },
  {
    key: 'quantity',
    label: 'Quantity',
  },
  {
    key: 'totalAmount',
    label: 'Total amount',
    render: (order) => formatAmount(order.totalAmount),
  },
  {
    key: 'status',
    label: 'Status',
    render: (order) => <StatusBadge status={order.status} />,
  },
  {
    key: 'createdAt',
    label: 'Created at',
    render: (order) => formatDate(order.createdAt),
  },
]

// Content displayed when "View details" is clicked.
function renderOrderDetails(order) {
  const details = [
    ['Order ID', order.id],
    ['Customer ID', order.customerId],
    ['Product ID', order.productId],
    ['Quantity', order.quantity],
    ['Unit price', formatAmount(order.unitPrice)],
    ['Total amount', formatAmount(order.totalAmount)],
    [
      'Status',
      <StatusBadge key="status" status={order.status} />,
    ],
    ['Created at', formatDate(order.createdAt)],
    ['Updated at', formatDate(order.updatedAt)],
  ]

  return (
    <dl>
      {details.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value ?? 'Not provided'}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function OrdersPage() {
  // API records and request status.
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Search and status filter.
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  // Fetch orders when the page opens.
  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const data = await getOrders(controller.signal)

        if (!Array.isArray(data)) {
          throw new Error('The orders response must be a list.')
        }

        if (!controller.signal.aborted) {
          setItems(data)
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

    loadItems()

    // Cancel the request when the page closes.
    return () => controller.abort()
  }, [])

  // Summary counts use all orders.
  const confirmedOrders = items.filter(
    (order) => order.status === 'CONFIRMED'
  ).length

  const cancelledOrders = items.filter(
    (order) => order.status === 'CANCELLED'
  ).length

  const summaries = [
    {
      label: 'Total orders',
      value: items.length,
      icon: <SummaryIcon type="available" />,
    },
    {
      label: 'Confirmed orders',
      value: confirmedOrders,
      icon: <SummaryIcon type="reserved" />,
    },
    {
      label: 'Cancelled orders',
      value: cancelledOrders,
      icon: <SummaryIcon type="warning" />,
    },
  ]

  // Apply search and status filtering to table records.
  const searchText = search.trim().toLowerCase()

  const filteredItems = items.filter((order) => {
    const matchesSearch = [
      order.id,
      order.customerId,
      order.productId,
    ].some((value) =>
      String(value ?? '').toLowerCase().includes(searchText)
    )

    const matchesStatus = !status || order.status === status

    return matchesSearch && matchesStatus
  })

  return (
    <ServicePage
      title="Orders"
      description="Track customer orders, amounts, and processing status."
      summaries={summaries}
      columns={columns}
      items={filteredItems}
      loading={loading}
      error={error}
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by order, customer, or product ID..."
      filters={
        <label className="service-filter">
          Status

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>

            {statuses.map((value) => (
              <option key={value} value={value}>
                {value
                  .toLowerCase()
                  .replaceAll('_', ' ')
                  .replace(/^./, (letter) => letter.toUpperCase())}
              </option>
            ))}
          </select>
        </label>
      }
      detailsTitle="Order details"
      renderDetails={renderOrderDetails}
      emptyMessage={
        items.length === 0
          ? 'No orders found.'
          : 'No orders match your filters.'
      }
    />
  )
}