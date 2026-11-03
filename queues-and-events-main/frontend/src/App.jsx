import ProductsPage from './pages/ProductsPage'
import CustomersPage from './pages/CustomersPage'
import InventoryPage from './pages/InventoryPage'
import OrdersPage from './pages/OrdersPage'
import PaymentsPage from './pages/PaymentsPage'
import NotificationsPage from './pages/NotificationsPage'
import './App.css'
import SummaryGrid from './components/Dashboard/SummaryGrid/SummaryGrid'
import RecentOrders from './components/Dashboard/RecentOrders/RecentOrders'
import LowStockItems from './components/Dashboard/LowStockItems/LowStockItems'
import OrderOverview from './components/Dashboard/OrderOverview/OrderOverview'
import QuickLinks from './components/Dashboard/QuickLinks/QuickLinks'
import NotificationSummary from './components/Dashboard/NotificationSummary/NotificationSummary'

export default function App() {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>Queues & Events</h2>
          <p>Store Manager</p>
        </div>

        <nav className="sidebar-nav" aria-label="Admin sections">
          <a href="#overview">Overview</a>
          <a href="#customers">Customers</a>
          <a href="#products">Products</a>
          <a href="#inventory">Inventory</a>
          <a href="#orders">Orders</a>
          <a href="#payments">Payments</a>
          <a href="#notifications">Notifications</a>
        </nav>
      </aside>

     <main className="dashboard-content" id="overview">
       <header className="dashboard-header">
         <h1>Dashboard</h1>
         <p>Your store at a glance</p>
       </header>

       <SummaryGrid />

       <div className="dashboard-row">
         <div className="dashboard-column">
           <RecentOrders />
           <OrderOverview />
         </div>

        <div className="dashboard-column">
          <LowStockItems />
          <QuickLinks />
          <NotificationSummary />
        </div>
       </div>
     </main>
    </div>
  )
}
