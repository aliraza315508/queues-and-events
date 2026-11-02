export async function getNotifications(signal) {
  const response = await fetch('/api/notifications', { signal })

  if (!response.ok) {
    throw new Error(`Could not load notifications: ${response.status}`)
  }

  return response.json()
}
