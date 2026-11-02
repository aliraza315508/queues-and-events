export async function getCustomers(signal) {
  const response = await fetch('/customers', { signal })

  if (!response.ok) {
    throw new Error(`Could not load customers: ${response.status}`)
  }

  return response.json()
}
