import { env } from '@/env.mjs';
import { DEMO_ADVISOR } from '@/features/crm/demoAdvisor';
import { describeCause, summarizeBody } from '@/features/crm/errorFormat';
import {
  assertSafeMagicLinkUrl,
  buildCreateDraftUrl,
  buildCreateMagicLinkUrl,
  buildTokenUrl,
} from '@/features/crm/urls';

const REQUEST_TIMEOUT_MS = 10_000;

const tenantHeaders = (accessToken: string): Record<string, string> => ({
  Authorization: `Bearer ${accessToken}`,
  'X-TENANT-NAME': env.DEMO_TENANT_SLUG,
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

const requestJson = async <T>(
  url: string,
  init: RequestInit,
  step: string
): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new Error(
      `${step} — échec réseau vers ${url} : ${describeCause(error)}`
    );
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${step} (HTTP ${response.status}) : ${summarizeBody(body)}`
    );
  }

  return (await response.json()) as T;
};

/**
 * Authenticates the external service account (client_credentials grant) against
 * the Keycloak realm (KEYCLOAK_REALM, or the demo tenant by default) — decoupled
 * from the tenant sent in the X-TENANT-NAME header.
 */
export const fetchServiceAccountToken = async (): Promise<string> => {
  const { access_token: accessToken } = await requestJson<{
    access_token: string;
  }>(
    buildTokenUrl(
      env.KEYCLOAK_BASE_URL,
      env.KEYCLOAK_REALM ?? env.DEMO_TENANT_SLUG
    ),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: env.SA_CLIENT_ID,
        client_secret: env.SA_CLIENT_SECRET,
      }),
    },
    'Token Keycloak'
  );
  return accessToken;
};

/**
 * Creates an empty PER transfer (all draft fields are optional) and returns its
 * id.
 */
export const createDraftTransfer = async (
  accessToken: string
): Promise<string> => {
  const { id } = await requestJson<{ id: string }>(
    buildCreateDraftUrl(env.DISTRIBUTEUR_API_BASE_URL),
    {
      method: 'POST',
      headers: tenantHeaders(accessToken),
      body: JSON.stringify({}),
    },
    'Création du draft'
  );
  return id;
};

/**
 * Generates the one-shot magic link for this transfer and the frozen advisor
 * identity, and returns the URL to redirect the browser to.
 */
export const createMagicLink = async (
  accessToken: string,
  transferId: string
): Promise<string> => {
  const { url } = await requestJson<{ url: string }>(
    buildCreateMagicLinkUrl(env.DISTRIBUTEUR_API_BASE_URL),
    {
      method: 'POST',
      headers: tenantHeaders(accessToken),
      body: JSON.stringify({ transferId, ...DEMO_ADVISOR }),
    },
    'Création du magic link'
  );
  return assertSafeMagicLinkUrl(url, env.DEMO_TENANT_SLUG);
};
