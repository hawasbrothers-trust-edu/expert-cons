import test from 'node:test';
import assert from 'node:assert/strict';
import { sendWeb3FormsEmail, WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT } from './web3forms';

test('sendWeb3FormsEmail sends a real POST JSON payload with access_key and handles success', async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = '';
  let capturedInit: RequestInit | undefined;

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedUrl = String(input);
    capturedInit = init;
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }) as typeof fetch;

  try {
    const res = await sendWeb3FormsEmail({
      subject: 'Test Subject',
      name: 'Ahmed',
      email: 'ahmed@example.com',
      message: 'Hello EXPERT',
    });

    assert.equal(capturedUrl, WEB3FORMS_ENDPOINT);
    assert.equal(capturedInit?.method, 'POST');
    const body = JSON.parse(String(capturedInit?.body));
    assert.equal(body.access_key, WEB3FORMS_ACCESS_KEY);
    assert.equal(body.access_key, '8ba5ef7a-eea0-4a02-905a-b3bcfff1c247');
    assert.equal(body.subject, 'Test Subject');
    assert.equal(res.success, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('sendWeb3FormsEmail returns error details gracefully when API fails', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid access key' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }) as typeof fetch;

  try {
    const res = await sendWeb3FormsEmail({
      subject: 'Failure Test',
      message: 'Should fail cleanly',
    });
    assert.equal(res.success, false);
    assert.equal(res.message, 'Invalid access key');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
