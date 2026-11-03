/* ========================================
   1. APPLICATION STYLES
   ======================================== */

import './App.css'


/* ========================================
   2. LAYOUT COMPONENTS
   ======================================== */

import Sidebar from './components/Dashboard/Sidebar/Sidebar'
import DashboardHeader from './components/Dashboard/DashboardHeader/DashboardHeader'


/* ========================================
   3. DASHBOARD COMPONENTS
   ======================================== */

import SummaryGrid from './components/Dashboard/SummaryGrid/SummaryGrid'
import RecentOrders from './components/Dashboard/RecentOrders/RecentOrders'
import LowStockItems from './components/Dashboard/LowStockItems/LowStockItems'
import OrderOverview from './components/Dashboard/OrderOverview/OrderOverview'
import QuickLinks from './components/Dashboard/QuickLinks/QuickLinks'
import NotificationSummary from './components/Dashboard/NotificationSummary/NotificationSummary'


/* ========================================
   4. APPLICATION
   ======================================== */

export default function App() {
  return (
    <div className="admin-layout">
      {/* Left navigation — rendered only once. */}
      <Sidebar />

      {/* Main dashboard content */}
      <main className="dashboard-content" id="overview">
        {/* Title, Admin display, and Refresh button */}
        <DashboardHeader />

        {/* Total orders, completed payments, customers, low stock */}
        <SummaryGrid />

        {/* Two-column dashboard layout */}
        <div className="dashboard-row">
          {/* Left column */}
          <div className="dashboard-column">
            <RecentOrders />
            <OrderOverview />
          </div>

          {/* Right column */}
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