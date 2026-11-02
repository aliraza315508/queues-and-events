import ProductsPage from './pages/ProductsPage'
import CustomersPage from './pages/CustomersPage'
import InventoryPage from './pages/InventoryPage'
import OrdersPage from './pages/OrdersPage'
import PaymentsPage from './pages/PaymentsPage'
import NotificationsPage from './pages/NotificationsPage'
import './App.css'

export default function App() {
  return (
    <main className="app">
      <header className="app-header">
        <h1>E-Commerce Platform</h1>
        <p>Browse data from all six Spring Boot services.</p>
        <nav className="app-nav" aria-label="Service sections">
          <a href="#product">Products</a>
          <a href="#customer">Customers</a>
          <a href="#inventory">Inventory</a>
          <a href="#order">Orders</a>
          <a href="#payment">Payments</a>
          <a href="#notification">Notifications</a>
        </nav>
      </header>
      <ProductsPage />
      <CustomersPage />
      <InventoryPage />
      <OrdersPage />
      <PaymentsPage />
      <NotificationsPage />
    </main>
  )
}
