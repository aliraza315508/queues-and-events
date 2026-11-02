export async function getPayments(signal) {
  const response = await fetch('/payments', { signal })

  if (!response.ok) {
    throw new Error(`Could not load payments: ${response.status}`)
  }

  return response.json()
}
