import { type KVContext } from '@tier-revealer/adapters/cloudflare/kv/KVContext';
import getStoredAuthChallenge from '@tier-revealer/adapters/cloudflare/kv/getAuthChallenge';
import putAuthChallenge from '@tier-revealer/adapters/cloudflare/kv/putAuthChallenge';
import createAuthChallenge from './createAuthChallenge';
import verifyToken from './riot/verifyToken';

interface Params {
  context: KVContext;
  riotIdToken: string;
}

export default async function getOrCreateAuthChallenge({ context, riotIdToken }: Params) {
  const { payload: claims } = await verifyToken({ token: riotIdToken });
  const riotSub = claims.sub!;

  const challenge = await getStoredAuthChallenge(context, { riotSub });
  if (challenge === null) {
    const created = createAuthChallenge();
    await putAuthChallenge(context, { riotSub, challenge: created });
    return created;
  }
  return challenge;
}
