import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { isLoggedIn, currentUser, logout, cartCount } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (!isLoggedIn) return null;

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>🛍️ ShopEasy</span>
      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/cart" style={styles.link} data-testid="cart-link">
          Cart {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
        </Link>
        <span style={styles.user}>👤 {currentUser}</span>
        <button onClick={handleLogout} style={styles.logoutBtn} data-testid="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1e293b', color: '#fff' },
  brand:     { fontSize: '20px', fontWeight: '600' },
  links:     { display: 'flex', gap: '20px', alignItems: 'center' },
  link:      { color: '#94a3b8', textDecoration: 'none', fontSize: '15px' },
  user:      { fontSize: '14px', color: '#cbd5e1' },
  badge:     { background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '1px 6px', fontSize: '11px', marginLeft: '4px' },
  logoutBtn: { background: 'transparent', border: '1px solid #475569', color: '#94a3b8', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
};
