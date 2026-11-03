import './LowStockItems.css'

export default function LowStockItems() {
  return (
    <section className="low-stock-panel">
      <h2>Low stock items</h2>
      <p>Products with 5 or fewer available units</p>

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
            <tr>
              <td>Wireless Headphones</td>
              <td>3</td>
              <td>2</td>
            </tr>

            <tr>
              <td>Canvas Backpack</td>
              <td>2</td>
              <td>1</td>
            </tr>

            <tr>
              <td>Water Bottle</td>
              <td>5</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}