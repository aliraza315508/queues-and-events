import './Sidebar.css'

// Navigation labels, destinations, and decorative icons.
const navigation = [
  {
    label: 'Overview',
    href: '#overview',
    icon: (
      <path
        d="m12 3 10 8h-3v10h-5v-7h-4v7H5V11H2Z"
        fill="currentColor"
        stroke="none"
      />
    ),
  },
  {
    label: 'Customers',
    href: '#customers',
    icon: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v2" />
      </>
    ),
  },
  {
    label: 'Products',
    href: '#products',
    icon: (
      <>
        <path d="M20 3h-8L3 12l9 9 9-9V4a1 1 0 0 0-1-1Z" />
        <circle cx="16" cy="8" r="1" />
      </>
    ),
  },
  {
    label: 'Inventory',
    href: '#inventory',
    icon: (
      <>
        <path d="m12 3 9 5v9l-9 5-9-5V8Z" />
        <path d="m3 8 9 5 9-5M12 13v9M7.5 5.5l9 5" />
      </>
    ),
  },
  {
    label: 'Orders',
    href: '#orders',
    icon: (
      <>
        <rect x="5" y="4" width="14" height="18" rx="2" />
        <rect x="9" y="2" width="6" height="4" rx="1" />
        <path d="M9 11h6M9 16h6" />
      </>
    ),
  },
  {
    label: 'Payments',
    href: '#payments',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18M7 14h4" />
      </>
    ),
  },
  {
    label: 'Notifications',
    href: '#notifications',
    icon: (
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    ),
  },
]

export default function Sidebar({activePage , onNavigate}) {
  return (
    <aside className="sidebar">
      {/* Store branding */}
      <div className="sidebar-brand">
        <h2>Queues & Events</h2>
        <p>Store Manager</p>
      </div>

      <nav className="sidebar-nav" aria-label="Admin sections">
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
           onClick={(event) => {
             event.preventDefault()
             const page = item.href.slice(1)

             if (
               page === 'overview' ||
               page === 'customers' ||
               page === 'products' ||
               page === 'inventory' ||
               page === 'orders' ||
               page === 'payments'
             ) {
               onNavigate(page)
             }
           }}
           className ={
               item.href === `#${activePage}` ? `active` : ``
               }
           aria-current={
               item.href === `#${activePage}` ? `page` : undefined
               }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {item.icon}
            </svg>

            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}