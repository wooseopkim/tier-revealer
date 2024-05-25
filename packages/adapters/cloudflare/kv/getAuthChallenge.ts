import { type KVContext } from './KVContext';

interface Params {
  riotSub: string;
}

export default async function getAuthChallenge({ namespace }: KVContext, { riotSub }: Params) {
  return await namespace.get(riotSub);
}
