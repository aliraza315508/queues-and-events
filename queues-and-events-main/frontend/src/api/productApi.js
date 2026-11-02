export async function getProducts(signal) {
  const response = await fetch('/products', { signal })

  if (!response.ok) {
    throw new Error(`Could not load products: ${response.status}`)
  }

  return response.json()
}
