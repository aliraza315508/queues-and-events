export async function getCustomers() {
  const response = await fetch('/customers')

  if (!response.ok) {
    throw new Error(`Could not load customers: ${response.status}`)
  }

  return response.json()
}