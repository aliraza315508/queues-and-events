export async function getInventory(signal) {
  const response = await fetch('/inventory', { signal })

  if (!response.ok) {
    throw new Error(`Could not load inventory: ${response.status}`)
  }

  return response.json()
}
