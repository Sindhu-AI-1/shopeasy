import { Page, expect } from '@playwright/test';

export class CartPage {
  // ── Selectors ────────────────────────────────────────────────────────────
  private placeOrderBtn       = '[data-testid="place-order-btn"]';
  private backToProductsBtn   = '[data-testid="back-to-products"]';
  private continueShoppingBtn = '[data-testid="continue-shopping"]';
  private cartTotal           = '[data-testid="cart-total"]';
  private subtotal            = '[data-testid="subtotal"]';
  private emptyCart           = '[data-testid="empty-cart"]';
  private orderSuccess        = '[data-testid="order-success"]';

  constructor(private page: Page) {}

  // ── Navigation ───────────────────────────────────────────────────────────
  async goto() {
    await this.page.goto('http://localhost:5173/cart');
  }

  // ── Actions ──────────────────────────────────────────────────────────────
  async increaseQty(productId: number) {
    await this.page.click(`[data-testid="increase-qty-${productId}"]`);
  }

  async decreaseQty(productId: number) {
    await this.page.click(`[data-testid="decrease-qty-${productId}"]`);
  }

  async removeItem(productId: number) {
    await this.page.click(`[data-testid="remove-item-${productId}"]`);
  }

  async placeOrder() {
    await this.page.click(this.placeOrderBtn);
  }

  async continueShopping() {
    await this.page.click(this.continueShoppingBtn);
  }

  async goBackToProducts() {
    await this.page.click(this.backToProductsBtn);
  }

  // ── Assertions ───────────────────────────────────────────────────────────
  async expectItemVisible(productId: number) {
    await expect(
      this.page.locator(`[data-testid="cart-item-${productId}"]`)
    ).toBeVisible();
  }

  async expectItemNotVisible(productId: number) {
    await expect(
      this.page.locator(`[data-testid="cart-item-${productId}"]`)
    ).not.toBeVisible();
  }

  async expectQty(productId: number, qty: number) {
    await expect(
      this.page.locator(`[data-testid="qty-${productId}"]`)
    ).toContainText(`${qty}`);
  }

  async expectLineTotal(productId: number, total: string) {
    await expect(
      this.page.locator(`[data-testid="line-total-${productId}"]`)
    ).toContainText(total);
  }

  async expectCartTotal(total: string) {
    await expect(this.page.locator(this.cartTotal)).toContainText(total);
  }

  async expectSubtotal(total: string) {
    await expect(this.page.locator(this.subtotal)).toContainText(total);
  }

  async expectEmptyCart() {
    await expect(this.page.locator(this.emptyCart)).toBeVisible();
  }

  async expectOrderSuccess() {
    await expect(this.page.locator(this.orderSuccess)).toBeVisible();
  }

  async expectRedirectedToLogin() {
    await expect(this.page).toHaveURL('http://localhost:5173/');
  }

  async expectRedirectedToProducts() {
    await expect(this.page).toHaveURL(/products/);
  }
}