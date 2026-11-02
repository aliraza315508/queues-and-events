import { useEffect, useState } from 'react'
import { getOrders } from '../api/orderApi'
import OrderCard from '../components/OrderCard'
import './css/OrdersPage.css'

export default function OrdersPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const data = await getOrders(controller.signal)
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
    <section id="order" className="order-page" aria-labelledby="order-heading">
      <h2 id="order-heading">Orders</h2>
      {loading && <p role="status">Loading orders...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No orders found.</p>}
      <div className="order-grid">
        {items.map((item) => <OrderCard key={item.id} order={item} />)}
      </div>
    </section>
  )
}
