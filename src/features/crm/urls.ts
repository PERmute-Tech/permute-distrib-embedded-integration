const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const TENANT_SLUG_PREFIX = 'pmd_';

/**
 * Keycloak `client_credentials` token endpoint for the given realm.
 */
export const buildTokenUrl = (keycloakBaseUrl: string, realm: string): string =>
  `${trimTrailingSlash(keycloakBaseUrl)}/realms/${realm}/protocol/openid-connect/token`;

export const buildCreateDraftUrl = (apiBaseUrl: string): string =>
  `${trimTrailingSlash(apiBaseUrl)}/transfers/per`;

export const buildCreateMagicLinkUrl = (apiBaseUrl: string): string =>
  `${trimTrailingSlash(apiBaseUrl)}/magic-links`;

// The magic link redirects the browser to the tenant subdomain — the backend
// serves it on the bare slug (pmd_ prefix stripped): we only accept http(s) and
// that subdomain, to guard against open-redirect.
export const assertSafeMagicLinkUrl = (
  url: string,
  tenantSlug: string
): string => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`URL de magic link invalide : ${url.slice(0, 200)}`);
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`Schéma de redirection refusé : ${parsed.protocol}`);
  }
  const expectedSubdomain = tenantSlug.startsWith(TENANT_SLUG_PREFIX)
    ? tenantSlug.slice(TENANT_SLUG_PREFIX.length)
    : tenantSlug;
  if (!parsed.hostname.startsWith(`${expectedSubdomain}.`)) {
    throw new Error(
      `Hôte du magic link inattendu (${parsed.hostname}) — ne correspond pas au tenant « ${tenantSlug} »`
    );
  }
  return parsed.toString();
};
