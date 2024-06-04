import { type KVContext } from './KVContext';

interface Params {
  puuid: string;
}

export default async function getRiotTokens({ namespace }: KVContext, { puuid }: Params) {
  const json = await (async () => {
    try {
      return await namespace.get(puuid);
    } catch (e: unknown) {
      return e as Error;
    }
  })();
  if (json === null || json instanceof Error) {
    return json;
  }
  return JSON.parse(json) as Record<string, string>;
}
