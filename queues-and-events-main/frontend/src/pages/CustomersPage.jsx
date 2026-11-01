import { useEffect, useState } from 'react'
import { getCustomers } from '../api/customerApi'
import CustomerCard from '../components/CustomersCard'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadCustomers() {
      try {
        const data = await getCustomers()

        if (!ignore) {
          setCustomers(data)
        }
      } catch (error) {
        if (!ignore) {
          setError(error.message)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadCustomers()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section>
      <h2>Customers</h2>

      {loading && <p>Loading customers...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && customers.length === 0 && (
        <p>No customers found.</p>
      )}

      {customers.map((customer) => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
    </section>
  )
}