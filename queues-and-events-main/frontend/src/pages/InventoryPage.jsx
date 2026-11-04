import { useEffect, useState } from 'react'
import { getInventory } from '../api/inventoryApi'
import ServicePage from '../components/ReueseableServiceTemplate/ServicePage'
import StatusBadge from '../components/ReueseableServiceTemplate/StatusBadge'
import SummaryIcon from '../components/ReueseableServiceTemplate/SummaryIcon'
import './css/InventoryPage.css'

// Inventory display rules.
const LOW_STOCK_THRESHOLD = 10
const STOCK_TARGET = 50 // Temporary target for the percentage bars.

// Table columns passed to the shared template.
const columns = [
  {
    key: 'productId',
    label: 'Product ID',
  },
  {
    key: 'availableQuantity',
    label: 'Available',
  },
  {
    key: 'reservedQuantity',
    label: 'Reserved',
  },
  {
    key: 'stockLevel',
    label: 'Stock level',

    render: (item) => {
      if (item.availableQuantity == null) {
        return 'Not provided'
      }

      const available = item.availableQuantity

      const status =
        available <= 0
          ? 'OUT_OF_STOCK'
          : available <= LOW_STOCK_THRESHOLD
            ? 'LOW_STOCK'
            : 'IN_STOCK'

      // Calculate the percentage and limit it to 0–100.
      const percentage = Math.min(
        100,
        Math.max(0, Math.round((available / STOCK_TARGET) * 100))
      )

      const tone =
        available <= 0
          ? 'danger'
          : available <= LOW_STOCK_THRESHOLD
            ? 'warning'
            : 'success'

      return (
        <div className="inventory-stock-level">
          <StatusBadge status={status} />

          <progress
            className={`inventory-stock-bar inventory-stock-bar--${tone}`}
            value={percentage}
            max={100}
            aria-label={`Stock against ${STOCK_TARGET}-unit target for ${item.productId}`}
          />

          <span>{percentage}%</span>
        </div>
      )
    },
  },
]

export default function InventoryPage() {
  // API records and request status.
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Search and checkbox state.
  const [search, setSearch] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)

  // Fetch inventory when the page opens.
  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const data = await getInventory(controller.signal)

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

  // Summary totals use all inventory records.
  const availableUnits = items.reduce(
    (total, item) => total + (item.availableQuantity ?? 0),
    0
  )

  const reservedUnits = items.reduce(
    (total, item) => total + (item.reservedQuantity ?? 0),
    0
  )

  const lowStockItems = items.filter(
    (item) =>
      item.availableQuantity != null &&
      item.availableQuantity <= LOW_STOCK_THRESHOLD
  ).length

  // Labels, values, and icons for the shared summary cards.
  const summaries = [
    {
      label: 'Available units',
      value: availableUnits.toLocaleString(),
      icon: <SummaryIcon type="available" />,
    },
    {
      label: 'Reserved units',
      value: reservedUnits.toLocaleString(),
      icon: <SummaryIcon type="reserved" />,
    },
    {
      label: 'Low stock items',
      value: lowStockItems,
      icon: (
        <span className="inventory-warning-icon">
          <SummaryIcon type="warning" />
        </span>
      ),
    },
  ]

  // Apply search and low-stock filtering to table records.
  const searchText = search.trim().toLowerCase()

  const filteredItems = items.filter((item) => {
    const matchesSearch = String(item.productId ?? '')
      .toLowerCase()
      .includes(searchText)

    const matchesStock =
      !lowStockOnly ||
      (
        item.availableQuantity != null &&
        item.availableQuantity <= LOW_STOCK_THRESHOLD
      )

    return matchesSearch && matchesStock
  })

  // Pass Inventory's data and controls to the shared template.
  return (
    <ServicePage
      title="Inventory"
      description="Track stock levels, reservations, and low stock items."
      summaries={summaries}
      columns={columns}
      items={filteredItems}
      loading={loading}
      error={error}
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by product ID..."
      filters={
        <label className="service-filter">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(event) =>
              setLowStockOnly(event.target.checked)
            }
          />
          Low stock only
        </label>
      }
      emptyMessage={
        items.length === 0
          ? 'No inventory records found.'
          : 'No inventory matches your filters.'
      }
    />
  )
}