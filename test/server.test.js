const test = require('node:test');
const assert = require('node:assert');
const app = require('../server.js');
const http = require('http');

let server;
let baseUrl;

test.before(() => {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(() => {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
});

test('GET /validation-key.txt - returns domain validation key', async () => {
  const res = await fetch(`${baseUrl}/validation-key.txt`);
  assert.strictEqual(res.status, 200);
  const text = await res.text();
  assert.ok(text.length > 0);
});

test('GET /api/health - returns status ok', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'ok');
  assert.strictEqual(data.service, 'Pi Immo Chain Tunisia API');
});

test('GET /api/properties - returns properties list', async () => {
  const res = await fetch(`${baseUrl}/api/properties`);
  assert.strictEqual(res.status, 200);
  const properties = await res.json();
  assert.ok(Array.isArray(properties));
  assert.ok(properties.length >= 6);
  assert.strictEqual(properties[0].id, 'tn-prop-001');
  assert.strictEqual(properties[0].city, 'سوسة');
});

test('GET /api/properties/:id - returns single property', async () => {
  const res = await fetch(`${baseUrl}/api/properties/tn-prop-002`);
  assert.strictEqual(res.status, 200);
  const prop = await res.json();
  assert.strictEqual(prop.title, 'فيلا عصرية في ضفاف البحيرة 2');
  assert.strictEqual(prop.city, 'تونس');
});

test('GET /api/blockchain/ledger - returns transaction history', async () => {
  const res = await fetch(`${baseUrl}/api/blockchain/ledger`);
  assert.strictEqual(res.status, 200);
  const ledger = await res.json();
  assert.ok(Array.isArray(ledger));
  assert.ok(ledger.length >= 2);
});

test('POST /api/pi/pay - executes Pi transaction successfully', async () => {
  const payload = {
    propertyId: 'tn-prop-003',
    buyerWallet: 'G_TEST_WALLET_123',
    amountPi: 300
  };

  const res = await fetch(`${baseUrl}/api/pi/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(data.txHash);
  assert.strictEqual(data.transaction.amountPi, 300);
});
