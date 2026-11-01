import { useState , useEffect } from 'react'
import './App.css'

function App() {
 const [products, setProducts] = useState([])
/*const [products, setProducts] = useState([
  {
    id: '1',
    name: 'Laptop',
    description: 'Laptop for Java development',
    price: 750
  }
])*/

  return (
    <main>
      <h1>E-Commerce Platform</h1>
      <p>Welcome to my React and Spring Boot application.</p>

      <h2>Products</h2>

      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: {product.price}</p>
        </div>
      ))}
    </main>
  )
}

export default App