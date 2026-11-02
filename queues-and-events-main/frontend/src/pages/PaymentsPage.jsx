import { useEffect, useState } from 'react'
import { getPayments } from '../api/paymentApi'
import PaymentCard from '../components/PaymentCard'
import './css/PaymentsPage.css'

export default function PaymentsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const data = await getPayments(controller.signal)
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
    <section id="payment" className="payment-page" aria-labelledby="payment-heading">
      <h2 id="payment-heading">Payments</h2>
      {loading && <p role="status">Loading payments...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No payments found.</p>}
      <div className="payment-grid">
        {items.map((item) => <PaymentCard key={item.id} payment={item} />)}
      </div>
    </section>
  )
}
