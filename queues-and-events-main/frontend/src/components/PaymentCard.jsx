export default function PaymentCard({ payment }) {
  return (
    <article className="payment-card">
      <h3>{payment.id ?? 'Payment'}</h3>
      <dl>
        <div><dt>ID</dt><dd>{payment.id ?? 'Not provided'}</dd></div>
        <div><dt>Order id</dt><dd>{payment.orderId ?? 'Not provided'}</dd></div>
        <div><dt>Customer id</dt><dd>{payment.customerId ?? 'Not provided'}</dd></div>
        <div><dt>Amount</dt><dd>{payment.amount ?? 'Not provided'}</dd></div>
        <div><dt>Payment method</dt><dd>{payment.paymentMethod ?? 'Not provided'}</dd></div>
        <div><dt>Status</dt><dd>{payment.status ?? 'Not provided'}</dd></div>
        <div><dt>Created at</dt><dd>{payment.createdAt ?? 'Not provided'}</dd></div>
        <div><dt>Updated at</dt><dd>{payment.updatedAt ?? 'Not provided'}</dd></div>
      </dl>
    </article>
  )
}
