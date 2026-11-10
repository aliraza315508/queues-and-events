import { useEffect, useState } from 'react'
import { getProducts } from '../api/productApi'
import ProductCard from '../components/ProductCard'
import './css/ProductsPage.css'

export default function ProductsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

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

  // Match products by name or SKU.
  const searchText = search.trim().toLowerCase()

  const filteredProducts = items.filter((product) => {
    const name = (product.name ?? '').toLowerCase()
    const sku = (product.sku ?? '').toLowerCase()

    return name.includes(searchText) || sku.includes(searchText)
  })

  return (
    <section className="product-page" aria-labelledby="product-heading">
      <header className="product-page-header page-banner">
        <h1 id="product-heading">Products</h1>
        <p>Browse and manage products available for sale in your store.</p>
      </header>

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
             onViewDetails={setSelectedProduct}
           />
            ))}
          </div>
        )
      )}
  {selectedProduct && (
    <div
      className="product-panel-backdrop"
      onClick={() => setSelectedProduct(null)}
    >
      <aside
        className="product-details-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-heading"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setSelectedProduct(null)
          }
        }}
      >
        <header className="product-panel-header">
          <h2 id="product-details-heading">Product details</h2>

          <button
            type="button"
            className="product-panel-close"
            aria-label="Close product details"
            autoFocus
            onClick={() => setSelectedProduct(null)}
          >
            ×
          </button>
        </header>

        <h3>{selectedProduct.name ?? 'Unnamed product'}</h3>

        <dl className="product-details-list">
          <div>
            <dt>ID</dt>
            <dd>{selectedProduct.id ?? 'Not provided'}</dd>
          </div>

          <div>
            <dt>SKU</dt>
            <dd>{selectedProduct.sku ?? 'Not provided'}</dd>
          </div>

          <div>
            <dt>Description</dt>
            <dd>{selectedProduct.description ?? 'Not provided'}</dd>
          </div>

          <div>
            <dt>Price</dt>
            <dd>
              {selectedProduct.price == null
                ? 'Not provided'
                : new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(selectedProduct.price)}
            </dd>
          </div>

          <div>
            <dt>Active</dt>
            <dd>
              {selectedProduct.active == null
                ? 'Not provided'
                : selectedProduct.active
                  ? 'Yes'
                  : 'No'}
            </dd>
          </div>

          <div>
            <dt>Created at</dt>
            <dd>{selectedProduct.createdAt ?? 'Not provided'}</dd>
          </div>

          <div>
            <dt>Updated at</dt>
            <dd>{selectedProduct.updatedAt ?? 'Not provided'}</dd>
          </div>
        </dl>
      </aside>
    </div>
  )}
    </section>
  )
}