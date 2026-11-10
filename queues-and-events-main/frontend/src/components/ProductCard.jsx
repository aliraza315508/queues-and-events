
import { productImages } from '../assets/productImages'

export default function ProductCard({
  product,
  expanded,
  onToggle,
}) {
  const image = productImages[product.sku]

  const price = product.price == null
    ? 'Price unavailable'
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(product.price)

  return (
    <article
      className={`product-card ${expanded ? 'product-card-expanded-active' : ''}`}
    >
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

      <button
        type="button"
        className="product-details-button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`product-details-${product.id}`}
      >
        {expanded ? 'Hide details' : 'View details'}
      </button>

      {/* Details appear inside the same product card. */}
      <div
        id={`product-details-${product.id}`}
        className="product-card-expanded"
        hidden={!expanded}
      >
        <dl className="product-details-list">
          <div>
            <dt>ID</dt>
            <dd>{product.id ?? 'Not provided'}</dd>
          </div>

          <div>
            <dt>Description</dt>
            <dd>{product.description ?? 'Not provided'}</dd>
          </div>

          <div>
            <dt>Active</dt>
            <dd>
              {product.active == null
                ? 'Not provided'
                : product.active ? 'Yes' : 'No'}
            </dd>
          </div>

          <div>
            <dt>Created at</dt>
            <dd>{product.createdAt ?? 'Not provided'}</dd>
          </div>

          <div>
            <dt>Updated at</dt>
            <dd>{product.updatedAt ?? 'Not provided'}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
