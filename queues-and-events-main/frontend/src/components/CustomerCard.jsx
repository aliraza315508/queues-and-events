export default function CustomerCard({ customer, onView }) {
  return (
    <article className="customer-card">
      {customer.photoUrl && (
        <img
          src={customer.photoUrl}
          alt={`${customer.fullName}'s profile`}
          width={80}
          height={80}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
      )}

      <h3>{customer.fullName ?? 'Account'}</h3>


      <button type="button" onClick={() => onView(customer)}>
        View account
      </button>
    </article>
  )
}