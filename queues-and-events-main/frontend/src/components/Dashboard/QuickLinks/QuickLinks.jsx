import './QuickLinks.css'

const links = [
  { label: 'Products', href: '#products' },
  { label: 'Inventory', href: '#inventory' },
  { label: 'Orders', href: '#orders' },
  { label: 'Notifications', href: '#notifications' },
]

export default function QuickLinks() {
  return (
    <section className="quick-links-panel">
      <h2>Quick links</h2>

      <nav className="quick-links-grid" aria-label="Store shortcuts">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </section>
  )
}