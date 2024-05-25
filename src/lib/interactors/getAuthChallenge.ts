import getStoredAuthChallenge from '$lib/adapters/cloudflare/kv/getAuthChallenge';
import putAuthChallenge from '$lib/adapters/cloudflare/kv/putAuthChallenge';
import type { KVNamespace } from '@cloudflare/workers-types/experimental';
import createAuthChallenge from './createAuthChallenge';

interface Params {
  namespace: KVNamespace;
  riotIdToken: string;
}

export default async function getAuthChallenge({ namespace, riotIdToken }: Params) {
  const challenge = await getStoredAuthChallenge({ namespace, riotIdToken });
  if (challenge === null) {
    const created = createAuthChallenge();
    await putAuthChallenge({ namespace, riotIdToken, challenge: created });
    return created;
  }
  return challenge;
}
