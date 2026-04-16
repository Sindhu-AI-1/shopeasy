import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal } = useApp();
  const [ordered, setOrdered] = useState(false);
  const navigate = useNavigate();

  function handleOrder() {
    setOrdered(true);
  }

  if (ordered) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successCard} data-testid="order-success">
          <div style={{ fontSize: '64px' }}>🎉</div>
          <h2 style={{ color: '#16a34a' }}>Order Placed!</h2>
          <p style={{ color: '#64748b' }}>Thank you for your purchase. Your order is on its way.</p>
          <button onClick={() => navigate('/products')} style={styles.btn} data-testid="continue-shopping">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successCard} data-testid="empty-cart">
          <div style={{ fontSize: '64px' }}>🛒</div>
          <h2 style={{ color: '#1e293b' }}>Your cart is empty</h2>
          <p style={{ color: '#64748b' }}>Add some products to get started.</p>
          <button onClick={() => navigate('/products')} style={styles.btn}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Your Cart</h2>

      <div style={styles.layout}>
        {/* Items list */}
        <div style={styles.items}>
          {cart.map((item) => (
            <div key={item.id} style={styles.item} data-testid={`cart-item-${item.id}`}>
              <div style={styles.itemEmoji}>{item.image}</div>
              <div style={styles.itemInfo}>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemPrice}>${item.price.toFixed(2)} each</p>
              </div>
              <div style={styles.qtyControls}>
                <button
                  data-testid={`decrease-qty-${item.id}`}
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  style={styles.qtyBtn}
                >−</button>
                <span data-testid={`qty-${item.id}`} style={styles.qty}>{item.qty}</span>
                <button
                  data-testid={`increase-qty-${item.id}`}
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  style={styles.qtyBtn}
                >+</button>
              </div>
              <span style={styles.lineTotal} data-testid={`line-total-${item.id}`}>
                ${(item.price * item.qty).toFixed(2)}
              </span>
              <button
                data-testid={`remove-item-${item.id}`}
                onClick={() => removeFromCart(item.id)}
                style={styles.removeBtn}
              >✕</button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span data-testid="subtotal">${cartTotal.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span style={{ color: '#16a34a' }}>Free</span>
          </div>
          <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
            <span>Total</span>
            <span data-testid="cart-total">${cartTotal.toFixed(2)}</span>
          </div>
          <button
            data-testid="place-order-btn"
            onClick={handleOrder}
            style={styles.orderBtn}
          >
            Place Order
          </button>
          <button
            onClick={() => navigate('/products')}
            style={styles.backBtn}
            data-testid="back-to-products"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:         { padding: '24px 32px', maxWidth: '1000px', margin: '0 auto' },
  heading:      { fontSize: '26px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' },
  layout:       { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' },
  items:        { display: 'flex', flexDirection: 'column', gap: '12px' },
  item:         { display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' },
  itemEmoji:    { fontSize: '36px' },
  itemInfo:     { flex: 1 },
  itemName:     { margin: '0 0 4px', fontWeight: '600', color: '#1e293b', fontSize: '15px' },
  itemPrice:    { margin: '0', color: '#64748b', fontSize: '13px' },
  qtyControls:  { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn:       { width: '28px', height: '28px', border: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' },
  qty:          { minWidth: '24px', textAlign: 'center', fontWeight: '600', fontSize: '15px' },
  lineTotal:    { fontWeight: '700', color: '#1e293b', minWidth: '64px', textAlign: 'right' },
  removeBtn:    { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px', padding: '4px' },
  summary:      { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', position: 'sticky', top: '80px' },
  summaryTitle: { margin: '0 0 20px', fontSize: '17px', fontWeight: '700', color: '#1e293b' },
  summaryRow:   { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#475569', marginBottom: '12px' },
  totalRow:     { fontWeight: '700', fontSize: '16px', color: '#1e293b', borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '4px' },
  orderBtn:     { width: '100%', padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  backBtn:      { width: '100%', padding: '10px', background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', marginTop: '8px' },
  successPage:  { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  successCard:  { textAlign: 'center', background: '#fff', padding: '48px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  btn:          { padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '16px' },
};
