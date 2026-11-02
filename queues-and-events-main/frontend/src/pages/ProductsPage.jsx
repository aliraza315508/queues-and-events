import { useEffect, useState } from 'react'
import { getProducts } from '../api/productApi'
import ProductCard from '../components/ProductCard'
import './css/ProductsPage.css'

export default function ProductsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const data = await getProducts(controller.signal)
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
    <section id="product" className="product-page" aria-labelledby="product-heading">
      <h2 id="product-heading">Products</h2>
      {loading && <p role="status">Loading products...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No products found.</p>}
      <div className="product-grid">
        {items.map((item) => <ProductCard key={item.id} product={item} />)}
      </div>
    </section>
  )
}
