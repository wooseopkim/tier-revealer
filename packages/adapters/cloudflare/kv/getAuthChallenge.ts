import { type KVContext } from './KVContext';

interface Params {
  riotSub: string;
}

export default async function getAuthChallenge({ namespace }: KVContext, { riotSub }: Params) {
  try {
    return await namespace.get(riotSub);
  } catch (e: unknown) {
    return e as Error;
  }
}
