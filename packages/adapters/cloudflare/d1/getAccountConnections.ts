import type D1Context from './D1Context';

interface Params {
  riotSub: string;
}

export default async function getAccountConnections({ database }: D1Context, { riotSub }: Params) {
  const query =
    'SELECT connection_type, connection_data, updated_at FROM account_connections WHERE riot_sub = ?';
  const statement = database.prepare(query).bind(riotSub);
  try {
    const { results } = await statement.all();
    return results;
  } catch (e: unknown) {
    return e as Error;
  }
}
