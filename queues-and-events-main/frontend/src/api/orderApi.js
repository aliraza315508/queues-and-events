export async function getOrders(signal) {
  const response = await fetch('/orders', { signal })

  if (!response.ok) {
    throw new Error(`Could not load orders: ${response.status}`)
  }

  return response.json()
}


export async function getOrdersByCustomerId(customerId , signal){
const response = await fetch(
       `/orders?customerId=${encodeURIComponent(customerId)}` ,
       {signal}
)

if(!response.ok){
throw new Error (`Could not load customer orders: ${response.status}`)}

return response.json()
}


