const { test } = require('node:test');
const assert = require('node:assert/strict');
const { askTutor } = require('../src/controllers/tutorController');

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('rejects invalid tutor requests before contacting Gemini', async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  const originalFetch = global.fetch;
  process.env.GEMINI_API_KEY = 'test-key';
  global.fetch = () => {
    throw new Error('fetch should not be called');
  };
  try {
    const res = createResponse();
    await askTutor({ body: { messages: [], mode: 'unknown' } }, res);
    assert.equal(res.statusCode, 400);
    assert.match(res.body.error, /messages/);
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
    global.fetch = originalFetch;
  }
});

test('rejects histories that exceed the supported message count', async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  const originalFetch = global.fetch;
  process.env.GEMINI_API_KEY = 'test-key';
  global.fetch = () => {
    throw new Error('fetch should not be called');
  };
  try {
    const messages = Array.from({ length: 21 }, (_, index) => ({
      role: index % 2 === 0 ? 'user' : 'assistant',
      content: 'Mensaje de prueba',
    }));
    const res = createResponse();
    await askTutor({ body: { messages } }, res);
    assert.equal(res.statusCode, 400);
    assert.match(res.body.error, /20/);
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
    global.fetch = originalFetch;
  }
});

test('returns a Gemini response without exposing provider details', async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  const originalFetch = global.fetch;
  process.env.GEMINI_API_KEY = 'test-key';
  let request;
  global.fetch = async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Respuesta de prueba' }] }, finishReason: 'STOP' }],
      }),
    };
  };
  try {
    const res = createResponse();
    await askTutor({ body: { messages: [{ role: 'user', content: 'Explícame el tema' }] } }, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { reply: 'Respuesta de prueba', truncated: false });
    assert.equal(request.options.headers['x-goog-api-key'], 'test-key');
    assert.equal(request.url.includes('test-key'), false);
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
    global.fetch = originalFetch;
  }
});

test('reports Gemini request errors without exposing the API key', async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  const originalFetch = global.fetch;
  const testKey = 'test-secret-key';
  process.env.GEMINI_API_KEY = testKey;
  global.fetch = async () => ({
    ok: false,
    status: 400,
    json: async () => ({
      error: { message: `Invalid model request with key ${testKey}` },
    }),
  });
  try {
    const res = createResponse();
    await askTutor({ body: { messages: [{ role: 'user', content: 'Hola' }] } }, res);
    assert.equal(res.statusCode, 502);
    assert.match(res.body.error, /Invalid model request/);
    assert.equal(res.body.error.includes(testKey), false);
  } finally {
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
    global.fetch = originalFetch;
  }
});
