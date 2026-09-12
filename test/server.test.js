const { test, describe } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('../server');

let server;
let baseUrl;

describe('Pi Immo Chain Tunisia Server API Tests', () => {
  test('Start test server instance', (t, done) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  test('GET /validation-key.txt - returns domain validation key', (t, done) => {
    http.get(`${baseUrl}/validation-key.txt`, (res) => {
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.headers['content-type'].includes('text/plain'), true);

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        assert.strictEqual(data.trim(), '428d3931b0c0a0dc0173257fa411af');
        done();
      });
    });
  });

  test('GET /api/health - returns status ok', (t, done) => {
    http.get(`${baseUrl}/api/health`, (res) => {
      assert.strictEqual(res.statusCode, 200);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        assert.strictEqual(json.status, 'ok');
        done();
      });
    });
  });

  test('GET /api/properties - returns properties list with lat/lng', (t, done) => {
    http.get(`${baseUrl}/api/properties`, (res) => {
      assert.strictEqual(res.statusCode, 200);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const properties = JSON.parse(data);
        assert.ok(Array.isArray(properties));
        assert.ok(properties.length >= 6);
        assert.ok(properties[0].lat);
        assert.ok(properties[0].lng);
        done();
      });
    });
  });

  test('POST /api/properties - creates new property and awards 50 $PIT', (t, done) => {
    const postData = JSON.stringify({
      title: 'شقة جديدة في صفاقس',
      city: 'صفاقس',
      type: 'شقة',
      pricePi: 200,
      space: 110,
      description: 'شقة ممتازة',
      sellerWallet: 'G_TEST_SELLER'
    });

    const req = http.request(`${baseUrl}/api/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      assert.strictEqual(res.statusCode, 201);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        assert.strictEqual(json.success, true);
        assert.strictEqual(json.reward.bonusPIT, 50);
        done();
      });
    });

    req.write(postData);
    req.end();
  });

  test('GET /api/chat/:propertyId & POST /api/chat - sends and receives chat messages', (t, done) => {
    const postData = JSON.stringify({
      propertyId: 'tn-prop-001',
      sender: 'مشتري مهتم',
      message: 'هل السعر قابل للتفاوض؟',
      senderWallet: 'G_TEST_USER'
    });

    const req = http.request(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      assert.strictEqual(res.statusCode, 201);

      // Verify GET returns updated messages
      http.get(`${baseUrl}/api/chat/tn-prop-001`, (getRes) => {
        assert.strictEqual(getRes.statusCode, 200);
        let data = '';
        getRes.on('data', chunk => data += chunk);
        getRes.on('end', () => {
          const msgs = JSON.parse(data);
          assert.ok(Array.isArray(msgs));
          assert.ok(msgs.some(m => m.message === 'هل السعر قابل للتفاوض؟'));
          done();
        });
      });
    });

    req.write(postData);
    req.end();
  });

  test('POST /api/rewards/claim - claims daily $PIT token reward', (t, done) => {
    const req = http.request(`${baseUrl}/api/rewards/claim`, {
      method: 'POST'
    }, (res) => {
      assert.strictEqual(res.statusCode, 200);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        assert.strictEqual(json.success, true);
        done();
      });
    });
    req.end();
  });

  test('GET /api/contract/:txHash - generates digital smart contract receipt', (t, done) => {
    http.get(`${baseUrl}/api/contract/0x8f3c9b12a`, (res) => {
      assert.strictEqual(res.statusCode, 200);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        assert.ok(json.contractTitle);
        assert.strictEqual(json.transactionDetails.txHash, '0x8f3c9b12a');
        done();
      });
    });
  });

  test('Close test server instance', (t, done) => {
    if (server) {
      server.close(() => done());
    } else {
      done();
    }
  });
});
