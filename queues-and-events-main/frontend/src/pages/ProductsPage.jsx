
import { useEffect, useState } from 'react'
import { getProducts } from '../api/productApi'
import ProductCard from '../components/ProductCard'
import DashboardHeader from '../components/Dashboard/DashboardHeader/DashboardHeader'
import './css/ProductsPage.css'

export default function ProductsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Only one product card can be expanded at a time.
  const [expandedProductId, setExpandedProductId] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const data = await getProducts(controller.signal)

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

  // Filter products by name or SKU.
  const searchText = search.trim().toLowerCase()

  const filteredProducts = items.filter((product) => {
    const name = (product.name ?? '').toLowerCase()
    const sku = (product.sku ?? '').toLowerCase()

    return name.includes(searchText) || sku.includes(searchText)
  })

  // Clicking the same card again collapses it.
  function toggleProduct(productId) {
    setExpandedProductId((currentId) =>
      currentId === productId ? null : productId
    )
  }

  return (
    <section
      className="product-page"
      aria-labelledby="product-heading"
    >
      <DashboardHeader
        title="Products"
        description="Browse and manage products available for sale in your store."
        headingId="product-heading"
      />

      <div className="product-search">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </svg>

        <input
          type="search"
          aria-label="Search products by name or SKU"
          placeholder="Search by product name or SKU..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && <p role="status">Loading products...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        filteredProducts.length === 0 ? (
          <p>
            {items.length === 0
              ? 'No products found.'
              : 'No products match your search.'}
          </p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                expanded={expandedProductId === product.id}
                onToggle={() => toggleProduct(product.id)}
              />
            ))}
          </div>
        )
      )}
    </section>
  )
}
