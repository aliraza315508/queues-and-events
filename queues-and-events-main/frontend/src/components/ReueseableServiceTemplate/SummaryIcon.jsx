export default function SummaryIcon({ type }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === 'available' && (
        <>
          <path d="m12 3 9 5v9l-9 5-9-5V8Z" />
          <path d="m3 8 9 5 9-5M12 13v9" />
        </>
      )}

      {type === 'reserved' && (
        <>
          <path d="m12 3 10 5-10 5L2 8Z" />
          <path d="m2 12 10 5 10-5M2 16l10 5 10-5" />
        </>
      )}

      {type === 'warning' && (
        <>
          <path d="M12 3 2 21h20Z" />
          <path d="M12 9v5M12 17h.01" />
        </>
      )}
    </svg>
  )
}