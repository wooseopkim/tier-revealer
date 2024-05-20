import {
  PUBLIC_RIOT_SIGN_ON_CLIENT_ID,
  PUBLIC_RIOT_SIGN_ON_REDIRECT_URI,
} from '$env/static/public';
import { RIOT_SIGN_ON_CLIENT_SECRET } from '$env/static/private';
import { decodeJwt } from 'jose';

export async function GET({ url, platform }) {
  const code = url.searchParams.get('code');

  if (code === null) {
    return new Response('search parameter `code` is required', { status: 400 });
  }

  const body = new URLSearchParams();
  body.set('grant_type', 'authorization_code');
  body.set('code', code);
  body.set('redirect_uri', PUBLIC_RIOT_SIGN_ON_REDIRECT_URI);
  const res = await fetch('https://auth.riotgames.com/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(PUBLIC_RIOT_SIGN_ON_CLIENT_ID + ':' + RIOT_SIGN_ON_CLIENT_SECRET)}`,
    },
    body: body,
  });

  if (!res.ok) {
    return new Response(await res.text(), { status: 500 });
  }

  const payload = (await res.json()) as {
    refresh_token: string;
    id_token: string;
    access_token: string;
  };
  const claims = decodeJwt(payload.id_token);
  await platform?.env.KV_NAMESPACE_RIOT_TOKENS.put(claims.sub!, JSON.stringify(payload));

  const params = new URLSearchParams();
  params.set('id_token', payload.id_token);

  return new Response('', { status: 307, headers: { Location: `/?${params.toString()}` } });
}
