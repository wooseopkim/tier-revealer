import { type KVContext } from './KVContext';

interface Params {
  riotSub: string;
  challenge: string;
}

export default async function putAuthChallenge(
  { namespace }: KVContext,
  { riotSub, challenge }: Params,
) {
  await namespace.put(riotSub, challenge, { expirationTtl: 120 });
}
