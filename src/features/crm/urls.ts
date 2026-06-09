const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

/**
 * Keycloak `client_credentials` token endpoint for the given realm.
 */
export const buildTokenUrl = (keycloakBaseUrl: string, realm: string): string =>
  `${trimTrailingSlash(keycloakBaseUrl)}/realms/${realm}/protocol/openid-connect/token`;

export const buildCreateDraftUrl = (apiBaseUrl: string): string =>
  `${trimTrailingSlash(apiBaseUrl)}/transfers/per`;

export const buildCreateMagicLinkUrl = (apiBaseUrl: string): string =>
  `${trimTrailingSlash(apiBaseUrl)}/magic-links`;

// The magic link redirects the browser to the tenant subdomain: we only
// accept http(s) and a host prefixed by the slug, to guard against open-redirect.
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
  if (!parsed.hostname.startsWith(`${tenantSlug}.`)) {
    throw new Error(
      `Hôte du magic link inattendu (${parsed.hostname}) — ne correspond pas au tenant « ${tenantSlug} »`
    );
  }
  return parsed.toString();
};
