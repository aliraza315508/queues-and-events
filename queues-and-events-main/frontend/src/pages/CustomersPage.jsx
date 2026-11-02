import { useEffect, useState } from 'react'
import { getCustomers } from '../api/customerApi'
import CustomerCard from '../components/CustomerCard'
import './css/CustomersPage.css'

export default function CustomersPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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
      <h2 id="customer-heading">Customers</h2>
      {loading && <p role="status">Loading customers...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No customers found.</p>}
      <div className="customer-grid">
        {items.map((item) => <CustomerCard key={item.id} customer={item} />)}
      </div>
    </section>
  )
}
