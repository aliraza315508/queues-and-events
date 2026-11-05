import { useState } from 'react'
import './ServicePage.css'

export default function ServicePage({
  title,
  description,

  // Optional summary cards
  summaries = [],

  // Search and service-specific filters
  search = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters,

  // Table configuration and records
  columns = [],
  items = [],

  // Optional details panel
  detailsTitle = 'Record details',
  renderDetails,

  loading = false,
  error = '',
  emptyMessage = 'No records to display.',
}) {
  // Store the selected record's ID.
  const [selectedId, setSelectedId] = useState(null)

  // Find the selected record in the current list.
  const selectedItem = items.find((item) => item.id === selectedId)

  const showDetails = Boolean(selectedItem && renderDetails)

  return (
    <section className={`service-page ${title.toLowerCase()}-page`}>
      {/* 1. Page heading */}
      <header className="service-page-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      {/* 2. Optional summary cards */}
      {summaries.length > 0 && (
        <div className="service-summary-grid">
          {summaries.map((summary) => (
            <article
              className="service-summary-card"
              key={summary.label}
            >
            {summary.icon && (
              <span className="service-summary-icon" aria-hidden="true">
                {summary.icon}
              </span>
            )}

            <div>
              <h2>{summary.label}</h2>
              <strong>{summary.value}</strong>
            </div>

            </article>
          ))}
        </div>
      )}

      {/* 3. Optional search and filter toolbar */}
      {(onSearchChange || filters) && (
        <div className="service-toolbar">
          {onSearchChange && (
            <label className="service-search">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>

              <input
                type="search"
                aria-label={searchPlaceholder}
                placeholder={searchPlaceholder}
                value={search}
                onChange={(event) =>
                  onSearchChange(event.target.value)
                }
              />
            </label>
          )}

          {filters}
        </div>
      )}

  {loading && (
    <p className="service-status" role="status">
      Loading {title.toLowerCase()}...
    </p>
  )}

  {error && (
    <p className="service-error" role="alert">
      {error}
    </p>
  )}

      {/* 4. Table and optional side panel */}
      {!loading && !error &&(
      <div
        className={`service-content-layout ${
          showDetails ? 'has-details' : ''
        }`}
      >
        {/* Table */}
        {columns.length > 0 && (
          <div className="service-table-wrapper">
            <table className="service-table">
              <caption>{title} records</caption>

              <thead>
                <tr>
                  {/* One heading for each configured column */}
                  {columns.map((column) => (
                    <th key={column.key} scope="col">
                      {column.label}
                    </th>
                  ))}

                  {/* One additional heading for the action button */}
                  {renderDetails && (
                    <th scope="col">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {/* One row for each record */}
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      selectedId === item.id
                        ? 'service-row-selected'
                        : ''
                    }
                  >
                    {/* One data cell for each configured column */}
                    {columns.map((column) => (
                      <td key={column.key}>
                        {column.render
                          ? column.render(item)
                          : item[column.key] ?? 'Not provided'}
                      </td>
                    ))}

                    {/* One details button per row */}
                    {renderDetails && (
                      <td>
                        <button
                          type="button"
                          className="service-details-button"
                          aria-label={`View details for ${item.id}`}
                          aria-expanded={selectedId === item.id}
                          onClick={() => setSelectedId(item.id)}
                        >
                          View details
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty state */}
            {items.length === 0 && (
             <p className="service-table-empty">
               {emptyMessage}
             </p>
            )}
          </div>
        )}

        {/* Side panel: each service supplies its content */}
        {showDetails && (
          <aside
            className="service-details-panel"
            aria-label={detailsTitle}
          >
            <header className="service-details-header">
              <h2>{detailsTitle}</h2>

              <button
                type="button"
                className="service-details-button"
                onClick={() => setSelectedId(null)}
              >
                Close
              </button>
            </header>

            {renderDetails(selectedItem)}
          </aside>
        )}
      </div>
      )}
    </section>
  )
}