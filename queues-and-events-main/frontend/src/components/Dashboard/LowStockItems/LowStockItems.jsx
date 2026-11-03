import { productImages } from '../../../assets/productImages'
import './LowStockItems.css'

// Sample data until we connect this panel to the inventory API.
const lowStockItems = [
  {
    name: 'Wireless Headphones',
    image: productImages['ADMIN-DEMO-008'],
    available: 3,
    reserved: 2,
  },
  {
    name: 'Canvas Backpack',
    image: productImages['ADMIN-DEMO-010'],
    available: 2,
    reserved: 1,
  },
  {
    name: 'Water Bottle',
    image: null,
    available: 5,
    reserved: 0,
  },
]

export default function LowStockItems() {
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
            {lowStockItems.map((item) => (
              <tr key={item.name}>
                <td>
                  {/* Keep the thumbnail beside the product name. */}
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