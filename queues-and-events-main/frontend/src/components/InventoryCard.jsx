export default function InventoryCard({ inventory }) {
  return (
    <article className="inventory-card">
      <h3>{inventory.id ?? 'Inventory'}</h3>

      <dl>
        <div>
          <dt>ID</dt>
          <dd>{inventory.id ?? 'Not provided'}</dd>
        </div>

        <div>
          <dt>Product ID</dt>
          <dd>{inventory.productId ?? 'Not provided'}</dd>
        </div>

        <div>
          <dt>Available quantity</dt>
          <dd>{inventory.availableQuantity ?? 'Not provided'}</dd>
        </div>

        <div>
          <dt>Reserved quantity</dt>
          <dd>{inventory.reservedQuantity ?? 'Not provided'}</dd>
        </div>

        <div>
          <dt>Created at</dt>
          <dd>{inventory.createdAt ?? 'Not provided'}</dd>
        </div>

        <div>
          <dt>Updated at</dt>
          <dd>{inventory.updatedAt ?? 'Not provided'}</dd>
        </div>
      </dl>
    </article>
  )
}