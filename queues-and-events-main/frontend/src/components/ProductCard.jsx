import { productImages } from '../assets/productImages'

export default function ProductCard({ product , onViewDetails }) {
  const image = productImages[product.sku]

  const price = product.price == null
    ? 'Price unavailable'
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(product.price)

  return (
    <article className="product-card">
      <div className="product-card-image">
        {image ? (
          <img
            src={image}
            alt={product.name ?? 'Product'}
            loading="lazy"
          />
        ) : (
          <span>No image available</span>
        )}
      </div>

      <h3>{product.name ?? 'Unnamed product'}</h3>

      <p className="product-card-sku">
        SKU: {product.sku ?? 'Not provided'}
      </p>

      <p className="product-card-price">{price}</p>

      <button type="button"
      className="product-details-button"
      onClick={() => onViewDetails(product)}
      >
        View details
      </button>
    </article>
  )
}