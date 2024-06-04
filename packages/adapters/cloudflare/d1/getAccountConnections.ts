import type D1Context from './D1Context';

interface Params {
  puuid: string;
}

export default async function getAccountConnections({ database }: D1Context, { puuid }: Params) {
  const query =
    'SELECT connection_type, connection_data, updated_at FROM account_connections WHERE puuid = ?';
  const statement = database.prepare(query).bind(puuid);
  try {
    const { results } = await statement.all();
    return results;
  } catch (e: unknown) {
    return e as Error;
  }
}
