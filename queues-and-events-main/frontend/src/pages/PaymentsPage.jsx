import { useEffect, useState } from 'react'
import { getPayments } from '../api/paymentApi'
import ServicePage from '../components/ReueseableServiceTemplate/ServicePage'
import StatusBadge from '../components/ReueseableServiceTemplate/StatusBadge'
import SummaryIcon from '../components/ReueseableServiceTemplate/SummaryIcon'
import './css/PaymentsPage.css'


function renderPaymentDetails(payment) {
  const amount = payment.amount == null
    ? 'Not provided'
    : Number(payment.amount).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })

  const details = [
    ['Payment ID', payment.id],
    ['Order ID', payment.orderId],
    ['Customer ID', payment.customerId],
    ['Amount', amount],
    ['Method', payment.paymentMethod],
    ['Status', <StatusBadge status={payment.status} />],
  ]

  return (
    <dl>
      {details.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value ?? 'Not provided'}</dd>
        </div>
      ))}
    </dl>
  )
}
export default function PaymentsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      try {
        const data = await getPayments(controller.signal)
        if (!controller.signal.aborted) setItems(data)
      } catch (error) {
        if (!controller.signal.aborted) setError(error.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadItems()
    return () => controller.abort()
  }, [])


// Filter the table while keeping summary cards based on all payments.
const filteredItems = items.filter((payment) => {
  const matchesSearch = String(payment.orderId ?? '')
    .toLowerCase()
    .includes(search.trim().toLowerCase())

  const matchesStatus = !status || payment.status === status

  return matchesSearch && matchesStatus
})


   return (
     <ServicePage
       title="Payments"
       description="View payment records processed for orders."
             summaries={[
               {
                 label: 'Completed amount',
                 value: items
                   .filter((payment) => payment.status === 'COMPLETED')
                   .reduce(
                     (total, payment) => total + Number(payment.amount ?? 0),
                     0
                   )
                   .toLocaleString('en-US', {
                     style: 'currency',
                     currency: 'USD',
                   }),
                 icon: <SummaryIcon type="available" />,
               },
               {
                 label: 'Completed',
                 value: items.filter(
                   (payment) => payment.status === 'COMPLETED'
                 ).length,
                 icon: <SummaryIcon type="reserved" />,
               },
               {
                 label: 'Failed',
                 value: items.filter(
                   (payment) => payment.status === 'FAILED'
                 ).length,
                 icon: <SummaryIcon type="warning" />,
               },
             ]}
       columns={[
         { key: 'id', label: 'Payment ID' },
         { key: 'orderId', label: 'Order ID' },
         { key: 'customerId', label: 'Customer ID' },
         { key: 'amount', label: 'Amount' },
         { key: 'paymentMethod', label: 'Method' },
         {
           key: 'status',
           label: 'Status',
           render: (payment) => (
             <StatusBadge status={payment.status} />
           ),
         },
       ]}
       items={filteredItems}
       search={search}
       onSearchChange={setSearch}
       searchPlaceholder="Search by order ID..."
       filters={
         <label className="service-filter">
           Status
           <select
             value={status}
             onChange={(event) => setStatus(event.target.value)}
           >
             <option value="">All statuses</option>
             <option value="COMPLETED">Completed</option>
             <option value="FAILED">Failed</option>
           </select>
         </label>
       }
       loading={loading}
       error={error}
       emptyMessage="No payments found."
       detailsTitle="Payment details"
       renderDetails={renderPaymentDetails}
     />
   )
}
