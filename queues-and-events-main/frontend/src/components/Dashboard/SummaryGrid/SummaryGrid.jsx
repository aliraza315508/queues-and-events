import './SummaryGrid.css'

const summaryItems = [
  {
    label: 'Total orders',
    value: '24',
    icon: 'cart',
  },
  {
    label: 'Completed payments',
    value: '$1,280',
    icon: 'payment',
  },
  {
    label: 'Customers',
    value: '12',
    icon: 'customers',
  },
  {
    label: 'Low stock',
    value: '3',
    icon: 'warning',
  },
]

function SummaryIcon({ type }) {
  const paths = {
    cart: (
      <>
     <path pathLength="1" d="M3 3h2l3 12h10l3-9H6" />
     <circle pathLength="1" cx="9" cy="20" r="1" />
     <circle pathLength="1" cx="18" cy="20" r="1" />
      </>
    ),
    payment: (
      <>
    <rect pathLength="1" x="3" y="5" width="18" height="14" rx="2" />
    <path pathLength="1" d="M3 9h18" />
    <path pathLength="1" d="M7 14h4" />
      </>
    ),
    customers: (
      <>
        icon: (
          <>
            <circle pathLength="1" cx="9" cy="8" r="3" />
            <path pathLength="1" d="M3 20v-2a6 6 0 0 1 12 0v2z" />
            <path pathLength="1" d="M16 5a3 3 0 0 1 0 6" />
            <path pathLength="1" d="M17 14a5 5 0 0 1 4 5v1h-3" />
          </>
        ),
      </>
    ),
    warning: (
      <>
  icon: (
    <>
      <path
        pathLength="1"
        d="M10.3 4.2 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"
      />
      <path pathLength="1" d="M12 9v5" />
      <path pathLength="1" d="M12 17h.01" />
    </>
  ),
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  )
}

export default function SummaryGrid() {
  return (
    <section className="summary-grid" aria-label="Store summary">
      {summaryItems.map((item) => (
        <article className="summary-card" key={item.label}>
          <span className="summary-card-icon">
            <SummaryIcon type={item.icon} />
          </span>

          <div className="summary-card-content">
            <h2>{item.label}</h2>
            <p>{item.value}</p>
          </div>
        </article>
      ))}
    </section>
  )
}