import './SummaryGrid.css'

export default function SummaryGrid() {
  return (
    <section className="summary-grid" aria-label="Store summary">
      <article className="summary-card">
        <h2>Total orders</h2>
        <p>24</p>
      </article>

      <article className="summary-card">
        <h2>Completed payments</h2>
        <p>$1,280</p>
      </article>

      <article className="summary-card">
        <h2>Customers</h2>
        <p>12</p>
      </article>

      <article className="summary-card">
        <h2>Low stock</h2>
        <p>3</p>
      </article>
    </section>
  )
}