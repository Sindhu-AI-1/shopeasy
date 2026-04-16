import { Page, expect } from '@playwright/test';

export class LoginPage {
  // ── Selectors ────────────────────────────────────────────────────────────
  private usernameInput = '[data-testid="username-input"]';
  private passwordInput = '[data-testid="password-input"]';
  private loginBtn      = '[data-testid="login-btn"]';
  private togglePassBtn = '[data-testid="toggle-password"]';
  private rememberMe    = '[data-testid="remember-me"]';
  private loginError    = '[data-testid="login-error"]';
  private usernameError = '[data-testid="username-error"]';
  private passwordError = '[data-testid="password-error"]';

  constructor(private page: Page) {}

  // ── Navigation ───────────────────────────────────────────────────────────
  async goto() {
    await this.page.goto('http://localhost:5173/');
  }

  // ── Actions ──────────────────────────────────────────────────────────────
  async fillUsername(username: string) {
    await this.page.fill(this.usernameInput, username);
  }

  async fillPassword(password: string) {
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin() {
    await this.page.click(this.loginBtn);
  }

  async togglePasswordVisibility() {
    await this.page.click(this.togglePassBtn);
  }

  async checkRememberMe() {
    await this.page.check(this.rememberMe);
  }

  async login(username: string, password: string) {
    await this.goto();
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  // ── Assertions ───────────────────────────────────────────────────────────
  async expectRedirectedToProducts() {
    await expect(this.page).toHaveURL(/products/);
  }

  async expectStillOnLoginPage() {
    await expect(this.page).not.toHaveURL(/products/);
  }

  async expectLoginError(message: string) {
    await expect(this.page.locator(this.loginError)).toContainText(message);
  }

  async expectUsernameError(message: string) {
    await expect(this.page.locator(this.usernameError)).toContainText(message);
  }

  async expectPasswordError(message: string) {
    await expect(this.page.locator(this.passwordError)).toContainText(message);
  }

  async expectPasswordType(type: 'password' | 'text') {
    await expect(this.page.locator(this.passwordInput)).toHaveAttribute('type', type);
  }

  async expectRememberMeChecked() {
    await expect(this.page.locator(this.rememberMe)).toBeChecked();
  }
}