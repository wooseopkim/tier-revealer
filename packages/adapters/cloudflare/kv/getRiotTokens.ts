import { type KVContext } from './KVContext';

interface Params {
  riotSub: string;
}

export default async function getRiotTokens({ namespace }: KVContext, { riotSub }: Params) {
  const json = await namespace.get(riotSub);
  if (json === null) {
    return null;
  }
  return JSON.parse(json) as Record<string, string>;
}
