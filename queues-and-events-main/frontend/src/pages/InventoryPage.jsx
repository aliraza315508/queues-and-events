import { useEffect, useState } from 'react'
import { getInventory } from '../api/inventoryApi'
import InventoryCard from '../components/InventoryCard'
import './css/InventoryPage.css'

export default function InventoryPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const data = await getInventory(controller.signal)
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
    <section id="inventory" className="inventory-page" aria-labelledby="inventory-heading">
      <h2 id="inventory-heading">Inventory</h2>
      {loading && <p role="status">Loading inventory...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No inventory found.</p>}
      <div className="inventory-grid">
        {items.map((item) => <InventoryCard key={item.id} inventory={item} />)}
      </div>
    </section>
  )
}
