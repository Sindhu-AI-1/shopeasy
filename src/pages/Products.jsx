import { useState } from 'react';
import { useApp } from '../context/AppContext';

const ALL_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 59.99,  category: 'Electronics', image: '🎧', rating: 4.5 },
  { id: 2, name: 'Running Shoes',       price: 89.99,  category: 'Fashion',     image: '👟', rating: 4.2 },
  { id: 3, name: 'Coffee Maker',        price: 45.00,  category: 'Kitchen',     image: '☕', rating: 4.7 },
  { id: 4, name: 'Yoga Mat',            price: 25.00,  category: 'Sports',      image: '🧘', rating: 4.3 },
  { id: 5, name: 'Backpack',            price: 49.99,  category: 'Fashion',     image: '🎒', rating: 4.1 },
  { id: 6, name: 'Smart Watch',         price: 129.99, category: 'Electronics', image: '⌚', rating: 4.6 },
  { id: 7, name: 'Blender',             price: 35.00,  category: 'Kitchen',     image: '🧃', rating: 4.0 },
  { id: 8, name: 'Basketball',          price: 29.99,  category: 'Sports',      image: '🏀', rating: 4.4 },
];

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Kitchen', 'Sports'];

export default function Products() {
  const { addToCart, cart } = useApp();
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [added, setAdded]       = useState({});

  const filtered = ALL_PRODUCTS.filter((p) => {
    const matchSearch   = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    return matchSearch && matchCategory;
  });

  function handleAdd(product) {
    addToCart(product);
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [product.id]: false })), 1200);
  }

  function cartQty(id) {
    return cart.find((i) => i.id === id)?.qty || 0;
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Our Products</h2>

      {/* Controls */}
      <div style={styles.controls}>
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
        <div style={styles.categories}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              data-testid={`filter-${cat.toLowerCase()}`}
              onClick={() => setCategory(cat)}
              style={{ ...styles.catBtn, ...(category === cat ? styles.catActive : {}) }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p data-testid="no-results" style={styles.empty}>No products found.</p>
      ) : (
        <div style={styles.grid}>
          {filtered.map((product) => (
            <div key={product.id} style={styles.card} data-testid={`product-card-${product.id}`}>
              <div style={styles.emoji}>{product.image}</div>
              <span style={styles.category}>{product.category}</span>
              <h3 style={styles.name} data-testid={`product-name-${product.id}`}>{product.name}</h3>
              <div style={styles.rating}>{'★'.repeat(Math.floor(product.rating))} {product.rating}</div>
              <div style={styles.footer}>
                <span style={styles.price} data-testid={`product-price-${product.id}`}>${product.price.toFixed(2)}</span>
                <button
                  data-testid={`add-to-cart-${product.id}`}
                  onClick={() => handleAdd(product)}
                  style={{ ...styles.addBtn, ...(added[product.id] ? styles.addedBtn : {}) }}
                >
                  {added[product.id] ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
              {cartQty(product.id) > 0 && (
                <p style={styles.inCart} data-testid={`in-cart-${product.id}`}>
                  {cartQty(product.id)} in cart
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page:       { padding: '24px 32px', maxWidth: '1100px', margin: '0 auto' },
  heading:    { fontSize: '26px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
  controls:   { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' },
  search:     { padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', maxWidth: '360px', outline: 'none' },
  categories: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  catBtn:     { padding: '6px 16px', border: '1px solid #e2e8f0', borderRadius: '20px', background: '#fff', cursor: 'pointer', fontSize: '13px', color: '#475569' },
  catActive:  { background: '#2563eb', color: '#fff', borderColor: '#2563eb' },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  card:       { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
  emoji:      { fontSize: '48px', textAlign: 'center' },
  category:   { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' },
  name:       { fontSize: '15px', fontWeight: '600', color: '#1e293b', margin: '0' },
  rating:     { fontSize: '13px', color: '#f59e0b' },
  footer:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' },
  price:      { fontSize: '17px', fontWeight: '700', color: '#2563eb' },
  addBtn:     { padding: '7px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  addedBtn:   { background: '#16a34a' },
  inCart:     { fontSize: '12px', color: '#16a34a', margin: '0', textAlign: 'right' },
  empty:      { color: '#94a3b8', fontSize: '15px', textAlign: 'center', marginTop: '60px' },
};
