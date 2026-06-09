/* eslint-disable no-process-env */
// @ts-check
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Server variables — owned by the BFF, never exposed to the browser.
   */
  server: {
    DISTRIBUTEUR_API_BASE_URL: z.string().url(),
    KEYCLOAK_BASE_URL: z.string().url(),
    KEYCLOAK_REALM: z.string().min(1).optional(),
    DEMO_TENANT_SLUG: z.string().min(1),
    SA_CLIENT_ID: z.string().min(1),
    SA_CLIENT_SECRET: z.string().min(1),
  },

  /**
   * Client variables. `NEXT_PUBLIC_ENV` drives the gating: the app is inert in production.
   */
  client: {
    NEXT_PUBLIC_ENV: z.enum(['development', 'preproduction', 'production']),
  },

  runtimeEnv: {
    DISTRIBUTEUR_API_BASE_URL: process.env.DISTRIBUTEUR_API_BASE_URL,
    KEYCLOAK_BASE_URL: process.env.KEYCLOAK_BASE_URL,
    KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
    DEMO_TENANT_SLUG: process.env.DEMO_TENANT_SLUG,
    SA_CLIENT_ID: process.env.SA_CLIENT_ID,
    SA_CLIENT_SECRET: process.env.SA_CLIENT_SECRET,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  },

  /**
   * `SKIP_ENV_VALIDATION` allows building without a real env (Docker, lint:next).
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
