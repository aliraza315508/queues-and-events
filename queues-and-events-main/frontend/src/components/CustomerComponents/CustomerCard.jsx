export default function CustomerCard({ customer, onView , isSelected }) {
  return (
<article
  className={`customer-card${isSelected ? ' customer-card--selected' : ''}`}
>      {customer.photoUrl ? (
        <img
          className="customer-photo"
          src={customer.photoUrl}
          alt={`${customer.fullName}'s profile`}
          width={64}
          height={64}
          loading="lazy"
        />
      ) : (
        <div className="customer-photo customer-photo-placeholder">
          {customer.fullName?.charAt(0) || '?'}
        </div>
      )}

      <div className="customer-info">
        <h3>{customer.fullName}</h3>
        <p>{customer.email}</p>
        <p>{customer.phone || 'Phone not available'}</p>
      </div>

      <button
        className="customer-view-button"
        type="button"
        onClick={() => onView(customer)}
      >
        View account
      </button>
    </article>
  )
}