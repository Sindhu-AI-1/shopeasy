import { test, expect } from '@playwright/test';

// ── Base URL for all API requests ─────────────────────────────────────────────
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// ══════════════════════════════════════════════════════════════════════════════
// GET REQUESTS — Read data
// ══════════════════════════════════════════════════════════════════════════════

test.describe('GET Requests', () => {

  test('TC-API-01 | GET all users returns 200 status', async ({ request }) => {
    // Send GET request to /users
    const response = await request.get(`${BASE_URL}/users`);

    // Check status code is 200 (success)
    expect(response.status()).toBe(200);

    // Parse response body as JSON
    const users = await response.json();

    // Check we got an array of users
    expect(Array.isArray(users)).toBeTruthy();

    // Check there are 10 users
    expect(users.length).toBe(10);

    console.log(`✓ Got ${users.length} users`);
  });

  test('TC-API-02 | GET single user returns correct data', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users/1`);

    // Check status code
    expect(response.status()).toBe(200);

    const user = await response.json();

    // Check user has correct fields
    expect(user.id).toBe(1);
    expect(user.name).toBe('Leanne Graham');
    expect(user.email).toBe('Sincere@april.biz');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('address');
    expect(user).toHaveProperty('phone');

    console.log(`✓ Got user: ${user.name}`);
  });

  test('TC-API-03 | GET non-existent user returns 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users/9999`);

    // Check status code is 404 (not found)
    expect(response.status()).toBe(404);

    console.log(`✓ Non-existent user correctly returned 404`);
  });

  test('TC-API-04 | GET all posts returns 200 status', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts`);

    expect(response.status()).toBe(200);

    const posts = await response.json();

    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBe(100);

    console.log(`✓ Got ${posts.length} posts`);
  });

  test('TC-API-05 | GET single post has correct fields', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts/1`);

    expect(response.status()).toBe(200);

    const post = await response.json();

    // Check all required fields exist
    expect(post).toHaveProperty('id');
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(post).toHaveProperty('userId');
    expect(post.id).toBe(1);

    console.log(`✓ Got post: "${post.title.substring(0, 30)}..."`);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// POST REQUESTS — Create data
// ══════════════════════════════════════════════════════════════════════════════

test.describe('POST Requests', () => {

  test('TC-API-06 | POST creates a new post and returns 201', async ({ request }) => {
    // Data to send in the request body
    const newPost = {
      title:  'ShopEasy Test Post',
      body:   'This post was created by Playwright API test',
      userId: 1,
    };

    // Send POST request with JSON body
    const response = await request.post(`${BASE_URL}/posts`, {
      data: newPost,
    });

    // Check status code is 201 (created)
    expect(response.status()).toBe(201);

    const created = await response.json();

    // Check the created post has our data
    expect(created.title).toBe(newPost.title);
    expect(created.body).toBe(newPost.body);
    expect(created.userId).toBe(newPost.userId);
    expect(created).toHaveProperty('id');   // server assigns an ID

    console.log(`✓ Created post with ID: ${created.id}`);
  });

  test('TC-API-07 | POST new user returns 201 with correct data', async ({ request }) => {
    const newUser = {
      name:     'John QA Engineer',
      username: 'johnqa',
      email:    'john.qa@shopeasy.com',
    };

    const response = await request.post(`${BASE_URL}/users`, {
      data: newUser,
    });

    expect(response.status()).toBe(201);

    const created = await response.json();

    expect(created.name).toBe(newUser.name);
    expect(created.email).toBe(newUser.email);
    expect(created).toHaveProperty('id');

    console.log(`✓ Created user: ${created.name} with ID: ${created.id}`);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// PUT REQUESTS — Update data
// ══════════════════════════════════════════════════════════════════════════════

test.describe('PUT Requests', () => {

  test('TC-API-08 | PUT updates a post and returns 200', async ({ request }) => {
    const updatedPost = {
      id:     1,
      title:  'Updated ShopEasy Post',
      body:   'This post was updated by Playwright API test',
      userId: 1,
    };

    const response = await request.put(`${BASE_URL}/posts/1`, {
      data: updatedPost,
    });

    // Check status code is 200 (success)
    expect(response.status()).toBe(200);

    const updated = await response.json();

    expect(updated.title).toBe(updatedPost.title);
    expect(updated.body).toBe(updatedPost.body);
    expect(updated.id).toBe(1);

    console.log(`✓ Updated post title: "${updated.title}"`);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// DELETE REQUESTS — Remove data
// ══════════════════════════════════════════════════════════════════════════════

test.describe('DELETE Requests', () => {

  test('TC-API-09 | DELETE removes a post and returns 200', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/posts/1`);

    // Check status code is 200 (success)
    expect(response.status()).toBe(200);

    console.log(`✓ Post deleted successfully`);
  });

});

// ══════════════════════════════════════════════════════════════════════════════
// RESPONSE HEADERS & CONTENT TYPE
// ══════════════════════════════════════════════════════════════════════════════

test.describe('Response Headers', () => {

  test('TC-API-10 | Response has correct content-type header', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users/1`);

    // Check content-type header contains application/json
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    console.log(`✓ Content-Type: ${contentType}`);
  });

  test('TC-API-11 | Response time is acceptable', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.get(`${BASE_URL}/users`);

    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);

    // Response should come back within 5 seconds
    expect(responseTime).toBeLessThan(5000);

    console.log(`✓ Response time: ${responseTime}ms`);
  });

});