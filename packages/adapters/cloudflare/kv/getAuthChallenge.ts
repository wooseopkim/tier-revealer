import { type KVContext } from './KVContext';

interface Params {
  puuid: string;
}

export default async function getAuthChallenge({ namespace }: KVContext, { puuid }: Params) {
  try {
    return await namespace.get(puuid);
  } catch (e: unknown) {
    return e as Error;
  }
}
