export async function getPayments(signal) {
  const response = await fetch('/payments', { signal })

  if (!response.ok) {
    throw new Error(`Could not load payments: ${response.status}`)
  }

  return response.json()
}

// Fetch payments belonging to one customer.
export async function getPaymentsByCustomerId(customerId, signal) {
  const response = await fetch(
    `/payments/customer/${encodeURIComponent(customerId)}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(`Could not load customer payments: ${response.status}`)
  }

  return response.json()
}