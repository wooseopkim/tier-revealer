import getOauth2Tokens from '$lib/third_parties/riot/api/getOauth2Tokens.js';
import putRiotTokens from '$lib/third_parties/cloudflare/kv/putRiotTokens.js';
import { decodeJwt } from 'jose';

export async function GET({ url, platform }) {
  const code = url.searchParams.get('code');

  if (code === null) {
    return new Response('search parameter `code` is required', { status: 400 });
  }

  const res = await getOauth2Tokens({ code });

  if (!res.ok) {
    return new Response(await res.text(), { status: 500 });
  }

  const payload = (await res.json()) as {
    refresh_token: string;
    id_token: string;
    access_token: string;
  };
  await putRiotTokens({
    namespace: platform!.env.KV_NAMESPACE_RIOT_TOKENS,
    payload,
  });

  const idToken = payload.id_token;
  const exp = decodeJwt(idToken).exp!
  const expires = new Date(exp * 1000).toUTCString();

  return new Response('', {
    status: 307,
    headers: {
      Location: '/',
      'Set-Cookie': `riot_id_token=${idToken}; Expires=${expires}; Secure; HttpOnly; Path=/`
    },
  });
}
