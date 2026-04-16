import { test } from './fixtures';

// ── beforeEach — logs in before every test ───────────────────────────────────
test.beforeEach(async ({ authenticatedPage }) => {});

// ══════════════════════════════════════════════════════════════════════════════
// DATA TABLES
// ══════════════════════════════════════════════════════════════════════════════

const searchCases = [
  { keyword: 'watch',    expectedCount: 1, description: 'exact keyword'     },
  { keyword: 'SHOES',    expectedCount: 1, description: 'uppercase keyword'  },
  { keyword: 'Shoes',    expectedCount: 1, description: 'mixed case keyword' },
  { keyword: 'xxxxxxxx', expectedCount: 0, description: 'no match keyword'  },
];

const categoryCases = [
  { category: 'electronics', expectedCount: 2, label: 'Electronics'   },
  { category: 'fashion',     expectedCount: 2, label: 'Fashion'        },
  { category: 'kitchen',     expectedCount: 2, label: 'Kitchen'        },
  { category: 'sports',      expectedCount: 2, label: 'Sports'         },
  { category: 'all',         expectedCount: 8, label: 'All categories' },
];

const productCards = [
  { productId: 1, name: 'Wireless Headphones', price: '$59.99' },
  { productId: 2, name: 'Running Shoes',        price: '$89.99' },
  { productId: 3, name: 'Coffee Maker',          price: '$45.00' },
];

// ══════════════════════════════════════════════════════════════════════════════
// POSITIVE — data-driven using for loop
// ══════════════════════════════════════════════════════════════════════════════

test('TC-PR-01 | Products page loads with 8 items',
  async ({ productsPage }) => {
    await productsPage.expectProductCount(8);
});

for (const { productId, name, price } of productCards) {
  test(`TC-PR-02 | Product card shows name and price — ${name}`,
    async ({ productsPage }) => {
      await productsPage.expectProductName(productId, name);
      await productsPage.expectProductPrice(productId, price);
  });
}

for (const { keyword, expectedCount, description } of searchCases) {
  test(`TC-PR-03 | Search — ${description} returns ${expectedCount} result(s)`,
    async ({ productsPage }) => {
      await productsPage.searchProduct(keyword);
      if (expectedCount === 0) {
        await productsPage.expectNoResults();
      } else {
        await productsPage.expectProductCount(expectedCount);
      }
  });
}

for (const { category, expectedCount, label } of categoryCases) {
  test(`TC-PR-05 | Filter by ${label} shows ${expectedCount} products`,
    async ({ productsPage }) => {
      await productsPage.filterByCategory(category);
      await productsPage.expectProductCount(expectedCount);
  });
}

for (const { productId, name } of productCards) {
  test(`TC-PR-06 | Add ${name} to cart shows in-cart label`,
    async ({ productsPage }) => {
      await productsPage.addToCart(productId);
      await productsPage.expectInCartLabel(productId, 1);
  });
}

test('TC-PR-07 | Adding same item twice increments count',
  async ({ productsPage }) => {
    await productsPage.addToCart(2);
    await productsPage.addToCart(2);
    await productsPage.expectInCartLabel(2, 2);
});

test('TC-PR-08 | Cart badge in navbar updates',
  async ({ productsPage }) => {
    await productsPage.addToCart(3);
    await productsPage.expectCartBadgeCount(1);
});

// ══════════════════════════════════════════════════════════════════════════════
// NEGATIVE
// ══════════════════════════════════════════════════════════════════════════════

test('TC-PR-09 | Unauthenticated user is redirected to login',
  async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.expectRedirectedToLogin();
});

test('TC-PR-11 | Switching to All resets category filter',
  async ({ productsPage }) => {
    await productsPage.filterByCategory('sports');
    await productsPage.expectProductCount(2);
    await productsPage.filterByCategory('all');
    await productsPage.expectProductCount(8);
});