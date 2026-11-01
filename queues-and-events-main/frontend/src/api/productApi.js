export async function getProducts() {
  const response = await fetch('/products')

  if (!response.ok) {
    throw new Error(`Could not load products: ${response.status}`)
  }

  return response.json()
}