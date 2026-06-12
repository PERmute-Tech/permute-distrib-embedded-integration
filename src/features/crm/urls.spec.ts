import { describe, expect, it } from 'vitest';

import {
  assertSafeMagicLinkUrl,
  buildCreateDraftUrl,
  buildCreateMagicLinkUrl,
  buildTokenUrl,
} from '@/features/crm/urls';

describe('crm urls', () => {
  it('builds the Keycloak token endpoint for the tenant realm', () => {
    expect(
      buildTokenUrl('https://keycloak.localhost:8280', 'distributeur')
    ).toBe(
      'https://keycloak.localhost:8280/realms/distributeur/protocol/openid-connect/token'
    );
  });

  it('does not produce a double slash when the base URL has a trailing slash', () => {
    expect(buildTokenUrl('https://keycloak.localhost:8280/', 'acme')).toBe(
      'https://keycloak.localhost:8280/realms/acme/protocol/openid-connect/token'
    );
  });

  it('builds the draft and magic-link endpoints from the API base URL', () => {
    expect(buildCreateDraftUrl('http://localhost:10001/distributeur')).toBe(
      'http://localhost:10001/distributeur/transfers/per'
    );
    expect(buildCreateMagicLinkUrl('http://localhost:10001/distributeur')).toBe(
      'http://localhost:10001/distributeur/magic-links'
    );
  });
});

describe('assertSafeMagicLinkUrl', () => {
  it('accepts a magic link hosted on the tenant subdomain', () => {
    const url = 'https://distributeur.localhost:4000/transfers/abc/initiation';
    expect(assertSafeMagicLinkUrl(url, 'distributeur')).toBe(url);
  });

  it('accepts a dedicated tenant served on its bare subdomain (pmd_ stripped)', () => {
    const url =
      'https://demodistrib.distributeur.preprod.permute-app.fr/transfers/abc/initiation';
    expect(assertSafeMagicLinkUrl(url, 'pmd_demodistrib')).toBe(url);
  });

  it('rejects a non-http(s) scheme (open-redirect guard)', () => {
    expect(() =>
      assertSafeMagicLinkUrl('javascript:alert(1)', 'distributeur')
    ).toThrow(/Schéma de redirection refusé/);
  });

  it('rejects a host that does not belong to the tenant', () => {
    expect(() =>
      assertSafeMagicLinkUrl('https://evil.example.com/x', 'distributeur')
    ).toThrow(/Hôte du magic link inattendu/);
  });

  it('rejects a malformed URL', () => {
    expect(() => assertSafeMagicLinkUrl('not a url', 'distributeur')).toThrow(
      /URL de magic link invalide/
    );
  });
});
