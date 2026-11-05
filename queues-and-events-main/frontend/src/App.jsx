import './App.css'
import { useState } from 'react'

// Layout components
import Sidebar from './components/Dashboard/Sidebar/Sidebar'
import DashboardHeader from './components/Dashboard/DashboardHeader/DashboardHeader'

// Dashboard components
import SummaryGrid from './components/Dashboard/SummaryGrid/SummaryGrid'
import RecentOrders from './components/Dashboard/RecentOrders/RecentOrders'
import LowStockItems from './components/Dashboard/LowStockItems/LowStockItems'
import OrderOverview from './components/Dashboard/OrderOverview/OrderOverview'
import QuickLinks from './components/Dashboard/QuickLinks/QuickLinks'
import NotificationSummary from './components/Dashboard/NotificationSummary/NotificationSummary'
import OrdersPage from './pages/OrdersPage'
import PaymentsPage from './pages/PaymentsPage'

// Service pages
import CustomersPage from './pages/CustomersPage'
import ProductsPage from './pages/ProductsPage'
import InventoryPage from './pages/InventoryPage'


export default function App() {
  const [activePage, setActivePage] = useState('overview')

  return (
    <div className="admin-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="dashboard-content">
        {activePage === 'overview' && (
          <>
            <DashboardHeader />
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
          </>
        )}

        {activePage === 'customers' && <CustomersPage />}
        {activePage === 'products' && <ProductsPage />}
        {activePage === 'inventory' && <InventoryPage />}
        {activePage === 'orders' && <OrdersPage />}
        {activePage === 'payments' && <PaymentsPage />}
      </main>
    </div>
  )
}