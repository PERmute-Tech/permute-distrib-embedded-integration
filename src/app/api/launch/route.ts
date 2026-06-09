import { NextResponse } from 'next/server';

import {
  createDraftTransfer,
  createMagicLink,
  fetchServiceAccountToken,
} from '@/features/crm/magicLinkClient';
import { isProductionGated } from '@/lib/gating';

/**
 * Fake CRM BFF: replays the external service-account flow in a single server
 * request (the magic link expires after 60s), then redirects the browser to the
 * distributeur journey with a 303 (PRG: the POST becomes a GET).
 */
export async function POST(request: Request) {
  if (isProductionGated()) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const accessToken = await fetchServiceAccountToken();
    const transferId = await createDraftTransfer(accessToken);
    const magicLinkUrl = await createMagicLink(accessToken, transferId);

    return NextResponse.redirect(magicLinkUrl, { status: 303 });
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error(
      '[permute-distrib-embedded-integration] launch échoué :',
      reason
    );
    const errorUrl = new URL('/error', request.url);
    errorUrl.searchParams.set('reason', reason.slice(0, 500));

    return NextResponse.redirect(errorUrl, { status: 303 });
  }
}
