export default function NotificationCard({ notification }) {
  return (
    <article className="notification-card">
      <h3>{notification.subject ?? 'Notification'}</h3>
      <dl>
        <div><dt>ID</dt><dd>{notification.id ?? 'Not provided'}</dd></div>
        <div><dt>Order id</dt><dd>{notification.orderId ?? 'Not provided'}</dd></div>
        <div><dt>Customer id</dt><dd>{notification.customerId ?? 'Not provided'}</dd></div>
        <div><dt>Recipient email</dt><dd>{notification.recipientEmail ?? 'Not provided'}</dd></div>
        <div><dt>Recipient phone</dt><dd>{notification.recipientPhone ?? 'Not provided'}</dd></div>
        <div><dt>Notification type</dt><dd>{notification.notificationType ?? 'Not provided'}</dd></div>
        <div><dt>Subject</dt><dd>{notification.subject ?? 'Not provided'}</dd></div>
        <div><dt>Message</dt><dd>{notification.message ?? 'Not provided'}</dd></div>
        <div><dt>Status</dt><dd>{notification.status ?? 'Not provided'}</dd></div>
        <div><dt>Created at</dt><dd>{notification.createdAt ?? 'Not provided'}</dd></div>
        <div><dt>Updated at</dt><dd>{notification.updatedAt ?? 'Not provided'}</dd></div>
      </dl>
    </article>
  )
}
