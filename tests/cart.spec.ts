import { test } from './fixtures';

// ── beforeEach — logs in + adds product 1 + goes to cart ────────────────────
test.beforeEach(async ({ authenticatedPage, productsPage }) => {
  await productsPage.addToCart(1);
  await productsPage.goToCart();
});

// ══════════════════════════════════════════════════════════════════════════════
// DATA TABLES
// ══════════════════════════════════════════════════════════════════════════════

const quantityIncreaseCases = [
  { increments: 1, expectedQty: 2, expectedTotal: '$119.98', description: 'increase by 1' },
  { increments: 2, expectedQty: 3, expectedTotal: '$179.97', description: 'increase by 2' },
  { increments: 3, expectedQty: 4, expectedTotal: '$239.96', description: 'increase by 3' },
];

const multipleProductCases = [
  { extraProduct: 2, expectedTotal: '$149.98', description: 'Headphones + Shoes'        },
  { extraProduct: 3, expectedTotal: '$104.99', description: 'Headphones + Coffee Maker' },
];

// ══════════════════════════════════════════════════════════════════════════════
// POSITIVE — data-driven using for loop
// ══════════════════════════════════════════════════════════════════════════════

test('TC-C-01 | Cart displays the added product',
  async ({ cartPage }) => {
    await cartPage.expectItemVisible(1);
});

test('TC-C-02 | Cart shows correct initial quantity',
  async ({ cartPage }) => {
    await cartPage.expectQty(1, 1);
});

for (const { increments, expectedQty, expectedTotal, description } of quantityIncreaseCases) {
  test(`TC-C-03 | Quantity — ${description} updates qty and total`,
    async ({ cartPage }) => {
      for (let i = 0; i < increments; i++) {
        await cartPage.increaseQty(1);
      }
      await cartPage.expectQty(1, expectedQty);
      await cartPage.expectLineTotal(1, expectedTotal);
  });
}

test('TC-C-04 | Decrease quantity updates item count',
  async ({ cartPage }) => {
    await cartPage.increaseQty(1);       // qty → 2
    await cartPage.decreaseQty(1);       // qty → 1
    await cartPage.expectQty(1, 1);
});

test('TC-C-05 | Decreasing qty to 0 removes item',
  async ({ cartPage }) => {
    await cartPage.decreaseQty(1);       // qty → 0 → removed
    await cartPage.expectEmptyCart();
});

test('TC-C-06 | Remove button removes only that item',
  async ({ productsPage, cartPage }) => {
    await cartPage.goBackToProducts();
    await productsPage.addToCart(2);
    await productsPage.goToCart();
    await cartPage.removeItem(1);
    await cartPage.expectItemNotVisible(1);
    await cartPage.expectItemVisible(2);
});

for (const { extraProduct, expectedTotal, description } of multipleProductCases) {
  test(`TC-C-07 | Cart total — ${description} = ${expectedTotal}`,
    async ({ productsPage, cartPage }) => {
      await cartPage.goBackToProducts();
      await productsPage.addToCart(extraProduct);
      await productsPage.goToCart();
      await cartPage.expectCartTotal(expectedTotal);
  });
}

test('TC-C-08 | Place Order shows success screen',
  async ({ cartPage }) => {
    await cartPage.placeOrder();
    await cartPage.expectOrderSuccess();
});

test('TC-C-09 | Continue Shopping after order goes to products',
  async ({ cartPage }) => {
    await cartPage.placeOrder();
    await cartPage.continueShopping();
    await cartPage.expectRedirectedToProducts();
});

test('TC-C-10 | Back to products button works',
  async ({ cartPage }) => {
    await cartPage.goBackToProducts();
    await cartPage.expectRedirectedToProducts();
});

// ══════════════════════════════════════════════════════════════════════════════
// NEGATIVE
// ══════════════════════════════════════════════════════════════════════════════

test('TC-C-12 | Unauthenticated user cannot access cart',
  async ({ cartPage }) => {
    await cartPage.goto();
    await cartPage.expectRedirectedToLogin();
});
