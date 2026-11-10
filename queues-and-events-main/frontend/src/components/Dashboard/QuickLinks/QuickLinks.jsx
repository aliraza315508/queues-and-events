import './QuickLinks.css'

// Each shortcut has a destination and a decorative SVG icon.
const links = [
  {
    label: 'Products',
    href: '#products',
 icon: (
   <>
     <path pathLength="1" d="M20 3h-8L3 12l9 9 9-9V4a1 1 0 0 0-1-1Z" />
     <circle pathLength="1" cx="16" cy="8" r="1" />
   </>
 ),
  },
  {
    label: 'Inventory',
    href: '#inventory',
icon: (
  <>
    <path pathLength="1" d="m12 3 9 5v9l-9 5-9-5V8Z" />
    <path pathLength="1" d="m3 8 9 5 9-5" />
    <path pathLength="1" d="M12 13v9M7.5 5.5l9 5" />
  </>
),
  },
  {
    label: 'Orders',
    href: '#orders',
icon: (
  <>
    <rect pathLength="1" x="5" y="4" width="14" height="18" rx="2" />
    <rect pathLength="1" x="9" y="2" width="6" height="4" rx="1" />
    <path pathLength="1" d="M9 11h6M9 16h6" />
  </>
),
  },
  {
    label: 'Notifications',
    href: '#notifications',
   icon: (
     <>
       <path
         pathLength="1"
         d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
       />
       <path pathLength="1" d="M10 21h4" />
     </>
   ),
  },
]

export default function QuickLinks() {
  return (
    <section className="quick-links-panel">
      <h2>Quick links</h2>

      <nav className="quick-links-grid" aria-label="Store shortcuts">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {/* Icon above the shortcut label. */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {link.icon}
            </svg>

            <span>{link.label}</span>
          </a>
        ))}
      </nav>
    </section>
  )
}