
import { useEffect, useState } from 'react'
import { getCustomers } from '../api/customerApi'
import CustomerCard from '../components/CustomerComponents/CustomerCard'
import CustomerActivity from '../components/CustomerComponents/CustomerActivity'
import DashboardHeader from '../components/Dashboard/DashboardHeader/DashboardHeader'
import './css/CustomersPage.css'

export default function CustomersPage() {
  // Customer data and request status
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Search and account details
  const [search, setSearch] = useState('')
  const [selectedAccount, setSelectedAccount] = useState(null)

  // Load customers
  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const data = await getCustomers(controller.signal)

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

    return () => controller.abort()
  }, [])

  // Filter customers
  const searchTerm = search.trim().toLowerCase()

  const filteredCustomers = items.filter((customer) => {
    const name = (customer.fullName || '').toLowerCase()
    const email = (customer.email || '').toLowerCase()

    return name.includes(searchTerm) || email.includes(searchTerm)
  })

  // Select customer to view account details
  function handleViewAccount(customer) {
    setSelectedAccount(customer)
  }

  return (
    <section
      id="customer"
      className="customer-page"
      aria-labelledby="customer-heading"
    >
      <DashboardHeader
        title="Customers"
        description="Manage customer accounts and view related activity."
        headingId="customer-heading"
      />

      {/* Search */}
      <label className="customer-search">
        <span>Search customers</span>

        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>

      {/* Request status */}
      {loading && <p role="status">Loading customers...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p>No customers found.</p>
      )}

      {!loading &&
        !error &&
        items.length > 0 &&
        filteredCustomers.length === 0 && (
          <p>No customers match your search.</p>
        )}

      {/* Customer list and details */}
      <div className="customer-layout">
        <div className="customer-grid">
          {filteredCustomers.map((item) => (
            <CustomerCard
              key={item.id}
              customer={item}
              onView={handleViewAccount}
              isSelected={selectedAccount?.id === item.id}
            />
          ))}
        </div>

        {selectedAccount && (
          <aside
            className="account-panel"
            aria-labelledby="account-panel-title"
          >
            {/* Panel header */}
            <div className="account-panel-header">
              <h2 id="account-panel-title">
                Account details
              </h2>

              <button
                className="account-close-button"
                type="button"
                onClick={() => setSelectedAccount(null)}
              >
                Close
              </button>
            </div>

            {/* Account information */}
            <dl>
              <div>
                <dt>Account ID</dt>
                <dd>{selectedAccount.id}</dd>
              </div>

              <div>
                <dt>Full name</dt>
                <dd>{selectedAccount.fullName}</dd>
              </div>

              <div>
                <dt>Email</dt>
                <dd>{selectedAccount.email}</dd>
              </div>

              <div>
                <dt>Phone</dt>
                <dd>{selectedAccount.phone || 'Not provided'}</dd>
              </div>
            </dl>

            {/* Customer-specific records fetched from backend */}
            <CustomerActivity
              key={selectedAccount.id}
              customerId={selectedAccount.id}
            />
          </aside>
        )}
      </div>
    </section>
  )
}
