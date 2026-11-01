import ProductsPage from './pages/ProductsPage'
import CustomersPage from './pages/CustomersPage'
import './App.css'

export default function App() {
  return (
    <main>
      <h1>E-Commerce Platform</h1>
      <p>Welcome to my React and Spring Boot application.</p>

      <ProductsPage />
      <CustomersPage />
    </main>
  )
}