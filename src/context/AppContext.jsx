import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

// ── Fake user credentials (no backend needed) ──────────────────────────────
const VALID_USERS = [
  { username: 'user@test.com', password: 'Test@1234' },
  { username: 'admin@test.com', password: 'Admin@1234' },
];

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  function login(username, password) {
    const user = VALID_USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user.username);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password.' };
  }

  function logout() {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCart([]);
  }

  // ── Cart ──────────────────────────────────────────────────────────────────
  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }

  function updateQty(productId, qty) {
    if (qty < 1) return removeFromCart(productId);
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, qty } : item))
    );
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <AppContext.Provider
      value={{ isLoggedIn, currentUser, login, logout, cart, addToCart, removeFromCart, updateQty, cartCount, cartTotal }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
