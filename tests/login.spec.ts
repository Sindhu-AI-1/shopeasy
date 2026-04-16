import { test, expect } from './fixtures';

// ── beforeEach — navigate to login page before every test ────────────────────
test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
});

// ══════════════════════════════════════════════════════════════════════════════
// DATA TABLES
// ══════════════════════════════════════════════════════════════════════════════

const validUsers = [
  { username: 'user@test.com',  password: 'Test@1234',  role: 'Standard User' },
  { username: 'admin@test.com', password: 'Admin@1234', role: 'Admin User'    },
];

const invalidCredentials = [
  { username: 'wrong@test.com', password: 'Test@1234',   reason: 'non-existent user' },
  { username: 'user@test.com',  password: 'WrongPass!9', reason: 'wrong password'    },
  { username: 'fake@fake.com',  password: 'Fake@1234',   reason: 'both wrong'        },
];

const sqlInjectionPayloads = [
  { payload: "' OR '1'='1",  description: 'basic OR injection'  },
  { payload: "' OR 1=1--",   description: 'comment injection'   },
  { payload: "admin'--",     description: 'admin bypass attempt' },
];

// ══════════════════════════════════════════════════════════════════════════════
// POSITIVE — data-driven using for loop
// ══════════════════════════════════════════════════════════════════════════════

for (const { username, password, role } of validUsers) {
  test(`TC-P-01 | Valid login — ${role}`, async ({ loginPage }) => {
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
    await loginPage.clickLogin();
    await loginPage.expectRedirectedToProducts();
  });
}

test('TC-P-03 | Remember me checkbox is clickable', async ({ loginPage }) => {
  await loginPage.checkRememberMe();
  await loginPage.expectRememberMeChecked();
});

test('TC-P-04 | Password show/hide toggle works', async ({ loginPage }) => {
  await loginPage.fillPassword('Test@1234');
  await loginPage.expectPasswordType('password');
  await loginPage.togglePasswordVisibility();
  await loginPage.expectPasswordType('text');
  await loginPage.togglePasswordVisibility();
  await loginPage.expectPasswordType('password');
});

// ══════════════════════════════════════════════════════════════════════════════
// NEGATIVE — data-driven using for loop
// ══════════════════════════════════════════════════════════════════════════════

test('TC-N-01 | Empty username shows validation error', async ({ loginPage }) => {
  //await loginPage.fillPassword('Test@1234');
  await loginPage.fillPassword('WrongPassword123');
  await loginPage.clickLogin();
  await loginPage.expectUsernameError('Username is required');
});

test('TC-N-02 | Empty password shows validation error', async ({ loginPage }) => {
  await loginPage.fillUsername('user@test.com');
  await loginPage.clickLogin();
  await loginPage.expectPasswordError('Password is required');
});

test('TC-N-03 | Both fields empty shows both errors', async ({ loginPage }) => {
  await loginPage.clickLogin();
  await loginPage.expectUsernameError('Username is required');
  await loginPage.expectPasswordError('Password is required');
});

test('TC-N-04 | Spaces-only password shows error', async ({ loginPage }) => {
  await loginPage.fillUsername('user@test.com');
  await loginPage.fillPassword('     ');
  await loginPage.clickLogin();
  await loginPage.expectPasswordError('Password cannot be blank');
});

for (const { username, password, reason } of invalidCredentials) {
  test(`TC-N-05 | Invalid login — ${reason}`, async ({ loginPage }) => {
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
    await loginPage.clickLogin();
    await loginPage.expectLoginError('Invalid username or password');
  });
}

// ── Security ─────────────────────────────────────────────────────────────────

for (const { payload, description } of sqlInjectionPayloads) {
  test(`TC-N-07 | SQL injection blocked — ${description}`, async ({ loginPage }) => {
    await loginPage.fillUsername(payload);
    await loginPage.fillPassword('anything');
    await loginPage.clickLogin();
    await loginPage.expectStillOnLoginPage();
  });
}

test('TC-N-08 | XSS payload does not execute', async ({ page, loginPage }) => {
  let alertFired = false;
  page.on('dialog', () => { alertFired = true; });
  await loginPage.fillUsername("<script>alert('xss')</script>");
  await loginPage.fillPassword('Pass@123');
  await loginPage.clickLogin();
  await loginPage.expectStillOnLoginPage();
  expect(alertFired).toBeFalsy();
});