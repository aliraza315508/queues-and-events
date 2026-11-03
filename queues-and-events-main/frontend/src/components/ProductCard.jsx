import { productImages } from '../assets/productImages'
export default function ProductCard({ product }) {
  return (
    <article className="product-card">
        {productImages[product.sku] && (
          <img
            src={productImages[product.sku]}
            alt={product.name}
            width={180}
            height={140}
            loading="lazy"
            style={{ objectFit: 'contain', borderRadius: '8px' }}
          />
        )}
      <h3>{product.name ?? 'Product'}</h3>
      <dl>
        <div><dt>ID</dt><dd>{product.id ?? 'Not provided'}</dd></div>
        <div><dt>Sku</dt><dd>{product.sku ?? 'Not provided'}</dd></div>
        <div><dt>Name</dt><dd>{product.name ?? 'Not provided'}</dd></div>
        <div><dt>Description</dt><dd>{product.description ?? 'Not provided'}</dd></div>
        <div><dt>Price</dt><dd>{product.price ?? 'Not provided'}</dd></div>
        <div><dt>Active</dt><dd>{product.active == null ? 'Not provided' : product.active ? 'Yes' : 'No'}</dd></div>
        <div><dt>Created at</dt><dd>{product.createdAt ?? 'Not provided'}</dd></div>
        <div><dt>Updated at</dt><dd>{product.updatedAt ?? 'Not provided'}</dd></div>
      </dl>
    </article>
  )
}
