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
        <nav className="app-nav" aria-label="Admin sections">
          <a href="#inventory">Inventory</a>
          <a href="#order">Orders</a>
          <a href="#notification">Notifications</a>
        </nav>
      </header>
        <CustomersPage />
    </main>
  )
}
