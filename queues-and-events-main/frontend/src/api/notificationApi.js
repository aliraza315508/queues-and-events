export async function getNotifications(signal) {
  const response = await fetch('/api/notifications', { signal })

  if (!response.ok) {
    throw new Error(`Could not load notifications: ${response.status}`)
  }

  return response.json()
}

// Fetch notifications belonging to one customer.
export async function getNotificationsByCustomerId(customerId, signal) {
  const response = await fetch(
    `/api/notifications/customer/${encodeURIComponent(customerId)}`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(`Could not load customer notifications: ${response.status}`)
  }

  return response.json()
}