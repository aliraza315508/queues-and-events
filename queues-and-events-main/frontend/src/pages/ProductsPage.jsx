import { useEffect, useState } from 'react'
import { getProducts } from '../api/productApi'
import ProductCard from '../components/ProductCard'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadProducts() {
      try {
        const data = await getProducts()

        if (!ignore) {
          setProducts(data)
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

    loadProducts()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section>
      <h2>Products</h2>

      {loading && <p>Loading products...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}

      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  )
}