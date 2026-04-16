import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';

// ── Define custom fixture types ───────────────────────────────────────────────
type Fixtures = {
  loginPage:    LoginPage;
  productsPage: ProductsPage;
  cartPage:     CartPage;
  authenticatedPage: void;
};

// ── Create fixtures ───────────────────────────────────────────────────────────
export const test = base.extend<Fixtures>({

  // Fixture 1: loginPage — creates LoginPage automatically
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Fixture 2: productsPage — creates ProductsPage automatically
  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await use(productsPage);
  },

  // Fixture 3: cartPage — creates CartPage automatically
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  // Fixture 4: authenticatedPage — auto login before every test
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('user@test.com', 'Test@1234');
    await page.waitForURL(/products/);
    await use();
  },
});

// ── Re-export expect so spec files only need to import from fixtures ──────────
export { expect } from '@playwright/test';