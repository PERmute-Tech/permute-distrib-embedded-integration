import { describe, expect, it } from 'vitest';

import { describeCause, summarizeBody } from '@/features/crm/errorFormat';

describe('summarizeBody', () => {
  it('extracts the Symfony error page <title> from an HTML body', () => {
    const html = `<!DOCTYPE html><html><head><title>Environment variable not found: "APP_GATEWAY_API_PREFIX". (500 Internal Server Error)</title></head><body>...</body></html>`;
    expect(summarizeBody(html)).toBe(
      'Environment variable not found: "APP_GATEWAY_API_PREFIX". (500 Internal Server Error)'
    );
  });

  it('bounds the message so a huge body cannot overflow the redirect header', () => {
    expect(summarizeBody('x'.repeat(5000)).length).toBeLessThanOrEqual(300);
  });

  it('falls back to the trimmed body when there is no title', () => {
    expect(summarizeBody('  {"detail":"boom"}  ')).toBe('{"detail":"boom"}');
  });
});

describe('describeCause', () => {
  it('unwraps the nested fetch cause (TLS, DNS, refused connection)', () => {
    const error = new Error('fetch failed', {
      cause: new Error('self-signed certificate'),
    });
    expect(describeCause(error)).toBe('fetch failed — self-signed certificate');
  });

  it('returns the message when there is no cause', () => {
    expect(describeCause(new Error('boom'))).toBe('boom');
  });
});
