import { type KVContext } from './KVContext';

interface Params {
  puuid: string;
  challenge: string;
}

export default async function putAuthChallenge(
  { namespace }: KVContext,
  { puuid, challenge }: Params,
) {
  try {
    return await namespace.put(puuid, challenge, { expirationTtl: 120 });
  } catch (e: unknown) {
    return e as Error;
  }
}
