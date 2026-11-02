import { useEffect, useState } from 'react'
import { getCustomers } from '../api/customerApi'
import CustomerCard from '../components/CustomerCard'
import './css/CustomersPage.css'

export default function CustomersPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const data = await getCustomers(controller.signal)
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
    <section id="customer" className="customer-page" aria-labelledby="customer-heading">
      <h2 id="customer-heading">Accounts</h2>
      {loading && <p role="status">Loading customers...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No customers found.</p>}
      <div className="customer-grid">

      {items.map((item) => (
        <CustomerCard
          key={item.id}
          customer={item}
          onView={setSelectedAccount}
        />
      ))}
      </div>

      {selectedAccount && (
        <aside className="account-panel" aria-labelledby="account-panel-title">
          <button
            type="button"
            onClick={() => setSelectedAccount(null)}
          >
            Close
          </button>

          <h2 id="account-panel-title">Account details</h2>

          {selectedAccount.photoUrl && (
            <img
              src={selectedAccount.photoUrl}
              alt={`${selectedAccount.fullName}'s profile`}
              width={100}
              height={100}
            />
          )}

          <dl>
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
              <dd>{selectedAccount.phone ?? 'Not provided'}</dd>
            </div>

            <div>
              <dt>Account ID</dt>
              <dd>{selectedAccount.id}</dd>
            </div>
          </dl>
        </aside>
      )}
    </section>
  )
}
