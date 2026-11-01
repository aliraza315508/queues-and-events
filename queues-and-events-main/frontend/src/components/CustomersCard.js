export default function CustomerCard({ customer }) {
  return (
    <article className="customers-card">
      <h3>{customer.fullName}</h3>

      <p><strong>ID:</strong> {customer.id}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Phone:</strong> {customer.phone ?? 'Not provided'}</p>
      <p><strong>Created:</strong> {customer.createdAt}</p>
      <p><strong>Updated:</strong> {customer.updatedAt}</p>
    </article>
  )
}