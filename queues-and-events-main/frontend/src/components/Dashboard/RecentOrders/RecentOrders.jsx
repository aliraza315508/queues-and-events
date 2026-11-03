import './RecentOrders.css'

export default function RecentOrders() {
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
            <tr>
              <td>#10024</td>
              <td>Emily Carter</td>
              <td>2</td>
              <td>$149.98</td>
              <td>
                <span className="status-badge status-success">
                  CONFIRMED
                </span>
              </td>
            </tr>

            <tr>
              <td>#10023</td>
              <td>James Park</td>
              <td>1</td>
              <td>$79.99</td>
              <td>
                <span className="status-badge status-warning">
                  CREATED
                </span>
              </td>
            </tr>

            <tr>
              <td>#10022</td>
              <td>Olivia Reed</td>
              <td>3</td>
              <td>$239.97</td>
              <td>
                <span className="status-badge status-danger">
                  CANCELLED
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}