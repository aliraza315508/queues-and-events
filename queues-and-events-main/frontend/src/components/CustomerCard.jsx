export default function CustomerCard({ customer }) {
  return (
    <article className="customer-card">
      <h3>{customer.fullName ?? 'Customer'}</h3>
      <dl>
        <div><dt>ID</dt><dd>{customer.id ?? 'Not provided'}</dd></div>
        <div><dt>Full name</dt><dd>{customer.fullName ?? 'Not provided'}</dd></div>
        <div><dt>Email</dt><dd>{customer.email ?? 'Not provided'}</dd></div>
        <div><dt>Phone</dt><dd>{customer.phone ?? 'Not provided'}</dd></div>
        <div><dt>Created at</dt><dd>{customer.createdAt ?? 'Not provided'}</dd></div>
        <div><dt>Updated at</dt><dd>{customer.updatedAt ?? 'Not provided'}</dd></div>
      </dl>
    </article>
  )
}
