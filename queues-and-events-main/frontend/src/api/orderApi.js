export async function getOrders(signal) {
  const response = await fetch('/orders', { signal })

  if (!response.ok) {
    throw new Error(`Could not load orders: ${response.status}`)
  }

  return response.json()
}
