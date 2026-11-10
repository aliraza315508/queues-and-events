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
    <path pathLength="1" d="m12 3 9 5v9l-9 5-9-5V8Z" />
    <path pathLength="1" d="m3 8 9 5 9-5" />
    <path pathLength="1" d="M12 13v9" />
  </>
)}

{type === 'reserved' && (
  <>
    <path pathLength="1" d="m12 3 10 5-10 5L2 8Z" />
    <path pathLength="1" d="m2 12 10 5 10-5" />
    <path pathLength="1" d="m2 16 10 5 10-5" />
  </>
)}

{type === 'warning' && (
  <>
    <path pathLength="1" d="M12 3 2 21h20Z" />
    <path pathLength="1" d="M12 9v5" />
    <path pathLength="1" d="M12 17h.01" />
  </>
)}
{type === 'payment-card' && (
  <>
    <rect pathLength="1" x="3" y="5" width="18" height="14" rx="2" />
    <path pathLength="1" d="M3 9h18" />
    <path pathLength="1" d="M7 14h4" />
  </>
)}

{type === 'payment-completed' && (
  <>
    <circle pathLength="1" cx="12" cy="12" r="9" />
    <path pathLength="1" d="m8 12 3 3 5-6" />
  </>
)}

{type === 'payment-failed' && (
  <>
    <circle pathLength="1" cx="12" cy="12" r="9" />
    <path pathLength="1" d="m9 9 6 6" />
    <path pathLength="1" d="m15 9-6 6" />
  </>
)}
    </svg>
  )
}