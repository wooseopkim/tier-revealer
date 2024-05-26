import { RIOT_SIGN_ON_CLIENT_SECRET } from '@tier-revealer/lib/env/private';
import {
  PUBLIC_RIOT_SIGN_ON_CLIENT_ID,
  PUBLIC_RIOT_SIGN_ON_REDIRECT_URI,
} from '@tier-revealer/lib/env/public';

interface Params {
  code: string;
}

export default async function getOauth2Tokens({ code }: Params) {
  const body = new URLSearchParams();
  body.set('grant_type', 'authorization_code');
  body.set('code', decodeURIComponent(code));
  body.set('redirect_uri', PUBLIC_RIOT_SIGN_ON_REDIRECT_URI);

  const res = await fetch('https://auth.riotgames.com/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(PUBLIC_RIOT_SIGN_ON_CLIENT_ID + ':' + RIOT_SIGN_ON_CLIENT_SECRET)}`,
    },
    body,
  });
  return res;
}
