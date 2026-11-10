// Load the styles for this header.
import './DashboardHeader.css'

export default function DashboardHeader({
  title = 'Dashboard',
  description = 'Your store at a glance',
  headingId,
  showOverviewActions = false,
})  {
  return (
    <header className="dashboard-header">
      {/* Left side: dashboard title and description. */}
      <div>
<h1 id={headingId}>{title}</h1>
<p>{description}</p>
      </div>

      {/* Right side: sample-data label, admin display, and refresh. */}

      {showOverviewActions && (<div className="dashboard-header-actions">
        <div className="dashboard-account">
          {/* Dashboard values are currently hardcoded samples. */}


          {/* Static admin display; this does not open a menu. */}
          <div className="admin-profile">
            {/* Decorative profile icon drawn with SVG. */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="12" />
              <circle cx="12" cy="8" r="4" fill="#fffaf0" />
              <path
                d="M5 20a7 7 0 0 1 14 0"
                fill="#fffaf0"
              />
            </svg>

            <span>Admin</span>
          </div>
        </div>

        {/* Reload the page when clicked.
            Sample values stay the same until APIs are connected. */}
        <button
          className="dashboard-refresh"
          type="button"
          onClick={() => window.location.reload()}
        >
          {/* Decorative refresh icon. */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 7v5h-5M4 17v-5h5" />
            <path d="M6 7a7 7 0 0 1 12-1l2 3M4 15l2 3a7 7 0 0 0 12-1" />
          </svg>

          Refresh data
        </button>
      </div>
      )}
    </header>
  )
}