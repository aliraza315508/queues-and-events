
import './LowStockItems.css'
import { useEffect, useState } from 'react'

import { getInventory } from '../../../api/inventoryApi'
import { getProducts } from '../../../api/productApi'
import { productImages } from '../../../assets/productImages'


// ========================================
// 1. LOW STOCK THRESHOLD
// ========================================

const LOW_STOCK_THRESHOLD = 10


// ========================================
// 2. LOW STOCK COMPONENT
// ========================================

export default function LowStockItems() {

  // Store low-stock products
  const [lowStockItems, setLowStockItems] = useState([])

  // Track API request status
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // ========================================
  // 3. FETCH BACKEND DATA
  // ========================================

  useEffect(() => {

    const controller = new AbortController()

    async function loadLowStockItems() {

      try {

        setError('')

        // Fetch inventory and products concurrently
        const [inventory, products] = await Promise.all([
          getInventory(controller.signal),
          getProducts(controller.signal),
        ])

        if (!Array.isArray(inventory) || !Array.isArray(products)) {
          throw new Error('Invalid inventory or product response')
        }


        // ========================================
        // 4. MATCH PRODUCTS WITH INVENTORY
        // ========================================

        const productMap = new Map(
          products.map((product) => [
            product.id,
            product,
          ])
        )


        // ========================================
        // 5. FILTER LOW-STOCK PRODUCTS
        // ========================================

        const lowStock = inventory
          .filter((item) =>
            item.availableQuantity != null &&
            Number.isFinite(Number(item.availableQuantity)) &&
            Number(item.availableQuantity) <= LOW_STOCK_THRESHOLD
          )


          // ========================================
          // 6. ADD PRODUCT NAMES AND IMAGES
          // ========================================

          .map((item) => {

            const product = productMap.get(item.productId)

            return {
              id: item.id,
              productId: item.productId,
              name: product?.name ?? 'Unknown product',
              image: productImages[product?.sku] ?? null,
              available: Number(item.availableQuantity),
              reserved: Number(item.reservedQuantity ?? 0),
            }

          })


          // ========================================
          // 7. SORT BY LOWEST STOCK FIRST
          // ========================================

          .sort((a, b) => a.available - b.available)


        // ========================================
        // 8. UPDATE REACT STATE
        // ========================================

        if (!controller.signal.aborted) {
          setLowStockItems(lowStock)
        }

      } catch (err) {

        if (!controller.signal.aborted) {
          setError(err.message || 'Failed to load low stock items')
        }

      } finally {

        if (!controller.signal.aborted) {
          setLoading(false)
        }

      }

    }

    loadLowStockItems()

    // Cancel pending requests during cleanup
    return () => controller.abort()

  }, [])


  // ========================================
  // 9. RENDER LOW STOCK TABLE
  // ========================================

  return (
    <section className="low-stock-panel">

      <h2>Low stock items</h2>

      <div className="stock-table-container">

        <table className="stock-table">

          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Available</th>
              <th scope="col">Reserved</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan="3">
                  Loading inventory...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan="3" role="alert">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && lowStockItems.length === 0 && (
              <tr>
                <td colSpan="3">
                  No low-stock products found.
                </td>
              </tr>
            )}

            {!loading && !error && lowStockItems.map((item) => (

              <tr key={item.id ?? item.productId}>

                <td>
                  <div className="stock-product">

                    <div className="stock-product-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <span className="stock-image-placeholder">
                          No image
                        </span>
                      )}

                    </div>

                    <span>{item.name}</span>

                  </div>
                </td>

                <td>{item.available}</td>

                <td>{item.reserved}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  )
}
