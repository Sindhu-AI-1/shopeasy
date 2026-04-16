import { Page, expect } from '@playwright/test';

export class ProductsPage {
  // ── Selectors ────────────────────────────────────────────────────────────
  private searchInput = '[data-testid="search-input"]';
  private noResults   = '[data-testid="no-results"]';
  private cartLink    = '[data-testid="cart-link"]';

  constructor(private page: Page) {}

  // ── Navigation ───────────────────────────────────────────────────────────
  async goto() {
    await this.page.goto('http://localhost:5173/products');
  }

  // ── Actions ──────────────────────────────────────────────────────────────
  async searchProduct(keyword: string) {
    await this.page.fill(this.searchInput, keyword);
  }

  async filterByCategory(category: string) {
    await this.page.click(`[data-testid="filter-${category.toLowerCase()}"]`);
  }

  async addToCart(productId: number) {
    await this.page.click(`[data-testid="add-to-cart-${productId}"]`);
  }

  async goToCart() {
    await this.page.click(this.cartLink);
  }

  // ── Assertions ───────────────────────────────────────────────────────────
  async expectProductCount(count: number) {
    await expect(
      this.page.locator('[data-testid^="product-card-"]')
    ).toHaveCount(count);
  }

  async expectProductName(productId: number, name: string) {
    await expect(
      this.page.locator(`[data-testid="product-name-${productId}"]`)
    ).toContainText(name);
  }

  async expectProductPrice(productId: number, price: string) {
    await expect(
      this.page.locator(`[data-testid="product-price-${productId}"]`)
    ).toContainText(price);
  }

  async expectInCartLabel(productId: number, qty: number) {
    await expect(
      this.page.locator(`[data-testid="in-cart-${productId}"]`)
    ).toContainText(`${qty} in cart`);
  }

  async expectCartBadgeCount(count: number) {
    await expect(this.page.locator(this.cartLink)).toContainText(`${count}`);
  }

  async expectNoResults() {
    await expect(this.page.locator(this.noResults)).toBeVisible();
  }

  async expectRedirectedToLogin() {
    await expect(this.page).toHaveURL('http://localhost:5173/');
  }
}