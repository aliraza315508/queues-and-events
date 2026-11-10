import { useEffect, useState } from 'react'
import { getCustomers } from '../api/customerApi'
import CustomerCard from '../components/CustomerCard'
import './css/CustomersPage.css'

export default function CustomersPage() {
  // Customer data and request status
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Search and account details
  const [search, setSearch] = useState('')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [accountTab, setAccountTab] = useState('orders')

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

  const accountTabLabel =
    accountTab.charAt(0).toUpperCase() + accountTab.slice(1)

  function handleViewAccount(customer) {
    setSelectedAccount(customer)
    setAccountTab('orders')
  }

  return (
    <section
      id="customer"
      className="customer-page"
      aria-labelledby="customer-heading"
    >
      <header className="page-banner">
        <h1 id="customer-heading">Customers</h1>
        <p>Manage customer accounts and view related activity.</p>
      </header>

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
              <h2 id="account-panel-title">Account details</h2>

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

            {/* Record navigation */}
            <nav
              className="account-tabs"
              aria-label="Customer records"
            >
              {['orders', 'payments', 'notifications'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={accountTab === tab ? 'active' : ''}
                  aria-pressed={accountTab === tab}
                  onClick={() => setAccountTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            {/* Record preview */}
            <div className="account-tab-content">
              <svg
                className="account-tab-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {accountTab === 'orders' ? (
                  <>
                    <path d="M3 3h2l3 12h10l3-9H6" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="18" cy="20" r="1" />
                  </>
                ) : accountTab === 'payments' ? (
                  <>
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />
                    <path d="M3 9h18M7 14h4" />
                  </>
                ) : (
                  <>
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                  </>
                )}
              </svg>

              <h3>{accountTabLabel} (proposed)</h3>

              <p>
                View this customer’s {accountTab} in a future release.
              </p>
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}