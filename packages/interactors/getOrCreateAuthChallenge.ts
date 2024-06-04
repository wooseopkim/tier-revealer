import { type KVContext } from '@tier-revealer/adapters/cloudflare/kv/KVContext';
import getStoredAuthChallenge from '@tier-revealer/adapters/cloudflare/kv/getAuthChallenge';
import putAuthChallenge from '@tier-revealer/adapters/cloudflare/kv/putAuthChallenge';
import createAuthChallenge from './createAuthChallenge';
import verifyToken from './riot/verifyToken';

interface Context extends KVContext {}

interface Params {
  riotIdToken: string;
}

export default async function getOrCreateAuthChallenge(context: Context, { riotIdToken }: Params) {
  const { payload: claims } = await verifyToken({ token: riotIdToken });
  const puuid = claims.sub!;

  const challenge = await getStoredAuthChallenge(context, { puuid });
  if (challenge instanceof Error) {
    return challenge;
  }
  if (challenge === null) {
    const created = createAuthChallenge();
    const result = await putAuthChallenge(context, { puuid, challenge: created });
    if (result instanceof Error) {
      return result;
    }
    return created;
  }
  return challenge;
}
