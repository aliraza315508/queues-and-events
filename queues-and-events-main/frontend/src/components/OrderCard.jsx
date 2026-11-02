export default function OrderCard({ order }) {
  return (
    <article className="order-card">
      <h3>{order.id ?? 'Order'}</h3>
      <dl>
        <div><dt>ID</dt><dd>{order.id ?? 'Not provided'}</dd></div>
        <div><dt>Customer id</dt><dd>{order.customerId ?? 'Not provided'}</dd></div>
        <div><dt>Product id</dt><dd>{order.productId ?? 'Not provided'}</dd></div>
        <div><dt>Quantity</dt><dd>{order.quantity ?? 'Not provided'}</dd></div>
        <div><dt>Unit price</dt><dd>{order.unitPrice ?? 'Not provided'}</dd></div>
        <div><dt>Total amount</dt><dd>{order.totalAmount ?? 'Not provided'}</dd></div>
        <div><dt>Status</dt><dd>{order.status ?? 'Not provided'}</dd></div>
        <div><dt>Created at</dt><dd>{order.createdAt ?? 'Not provided'}</dd></div>
        <div><dt>Updated at</dt><dd>{order.updatedAt ?? 'Not provided'}</dd></div>
      </dl>
    </article>
  )
}
