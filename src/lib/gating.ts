import { env } from '@/env.mjs';

// The partner CRM simulator is available in development and preproduction
// only: inert (404) in production.
export const isProductionGated = (): boolean =>
  env.NEXT_PUBLIC_ENV === 'production';
