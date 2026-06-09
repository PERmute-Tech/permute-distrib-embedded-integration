const MAX_ERROR_SNIPPET = 300;

/**
 * Keeps a bounded message: the Symfony error page <title> (HTML) or the start of
 * the body. Avoids injecting a whole HTML page into the redirect URL (otherwise
 * the Location header overflows).
 */
export const summarizeBody = (body: string): string => {
  const title = body.match(/<title>(.*?)<\/title>/is)?.[1];
  const text = (title ?? body).replace(/\s+/g, ' ').trim();
  return text.slice(0, MAX_ERROR_SNIPPET);
};

/**
 * Unwraps a `fetch` error `cause` (TLS, DNS, refused connection) into a
 * readable message.
 */
export const describeCause = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return String(error);
  }
  const cause = (error as { cause?: unknown }).cause;
  if (cause instanceof Error) {
    return `${error.message} — ${cause.message}`;
  }
  return cause ? `${error.message} — ${String(cause)}` : error.message;
};
