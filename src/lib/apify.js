import { API_BASE } from './api';

const TIMEOUT_MS = 30_000;

/**
 * Run an Apify actor via our server-side proxy.
 *
 * @param {string} actorSlug  e.g. 'supreme_coder~linkedin-profile-scraper'
 * @param {object} inputBody  The actor input JSON
 * @param {number} [timeoutMs=30000]  Abort after this many milliseconds
 * @returns {Promise<Array>}  The Apify dataset items array
 * @throws {Error}  On timeout, non-2xx, or parse failure
 */
export async function runActor(actorSlug, inputBody, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}/api/apify/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actor: actorSlug, input: inputBody }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || `Apify proxy error: ${res.status}`);
    }

    const data = await res.json();

    // The proxy returns { items: [...] }
    if (!Array.isArray(data?.items)) {
      throw new Error('Unexpected response from Apify proxy');
    }

    return data.items;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Could not fetch LinkedIn data. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
