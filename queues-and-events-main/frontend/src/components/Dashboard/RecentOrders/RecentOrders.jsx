
import './RecentOrders.css'
import { useEffect, useState } from 'react'

import { getOrders } from '../../../api/orderApi'
import { getCustomers } from '../../../api/customerApi'


// ========================================
// 1. FORMAT ORDER AMOUNT
// ========================================

function formatAmount(amount) {
  const value = Number(amount)

  if (!Number.isFinite(value)) {
    return '—'
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}


// ========================================
// 2. DETERMINE STATUS COLOR
// ========================================

function getStatusClass(status) {
  if (status === 'CONFIRMED') {
    return 'status-success'
  }

  if (
    status === 'CANCELLED' ||
    status === 'PAYMENT_FAILED' ||
    status === 'INVENTORY_REJECTED'
  ) {
    return 'status-danger'
  }

  return 'status-neutral'
}


// ========================================
// 3. RECENT ORDERS COMPONENT
// ========================================

export default function RecentOrders() {

  // Store orders fetched from backend
  const [orders, setOrders] = useState([])

  // Store customer names using customer IDs
  const [customers, setCustomers] = useState({})

  // Request states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // ========================================
  // 4. FETCH BACKEND DATA
  // ========================================

  useEffect(() => {

    const controller = new AbortController()

    async function loadRecentOrders() {
      try {

        // Fetch orders and customers concurrently
        const [orderData, customerData] =
          await Promise.all([
            getOrders(controller.signal),
            getCustomers(controller.signal),
          ])

        if (
          !Array.isArray(orderData) ||
          !Array.isArray(customerData)
        ) {
          throw new Error('Invalid backend response')
        }


        // ========================================
        // 5. SORT ORDERS BY CREATION DATE
        // ========================================

        const recentOrders = [...orderData]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, 5)


        // ========================================
        // 6. MAP CUSTOMER IDS TO NAMES
        // ========================================

        const customerMap = {}

        customerData.forEach((customer) => {
          customerMap[customer.id] = customer.fullName
        })


        // ========================================
        // 7. UPDATE REACT STATE
        // ========================================

        if (!controller.signal.aborted) {
          setOrders(recentOrders)
          setCustomers(customerMap)
        }

      } catch (err) {

        if (!controller.signal.aborted) {
          setError(err.message)
        }

      } finally {

        if (!controller.signal.aborted) {
          setLoading(false)
        }

      }
    }

    loadRecentOrders()

    return () => controller.abort()

  }, [])


  // ========================================
  // 8. RENDER RECENT ORDERS TABLE
  // ========================================

  return (
    <section className="orders-panel">

      <h2>Recent orders</h2>

      <p>The latest customer orders across your store</p>

      <div className="table-container">

        <table className="orders-table">

          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Customer</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan="5">
                  Loading recent orders...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan="5" role="alert">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && orders.length === 0 && (
              <tr>
                <td colSpan="5">
                  No orders found.
                </td>
              </tr>
            )}

            {!loading && !error && orders.map((order) => (

              <tr key={order.id}>

                <td title={order.id}>
                  #{order.id.slice(0, 8)}
                </td>

                <td>
                  {customers[order.customerId] ??
                    order.customerId}
                </td>

                <td>
                  {order.quantity}
                </td>

                <td>
                  {formatAmount(order.totalAmount)}
                </td>

                <td>
                  <span
                    className={`status-badge ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  )
}
