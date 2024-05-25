<script lang="ts">
  import {
    PUBLIC_RIOT_SIGN_ON_CLIENT_ID,
    PUBLIC_RIOT_SIGN_ON_REDIRECT_URI,
  } from '$env/static/public';

  export let riotIdentity: Record<string, string> | null = null;

  const signOnUrl = new URL('https://auth.riotgames.com');
  signOnUrl.pathname = 'authorize';
  const signOnParams = new URLSearchParams();
  signOnParams.set('client_id', PUBLIC_RIOT_SIGN_ON_CLIENT_ID);
  signOnParams.set('redirect_uri', PUBLIC_RIOT_SIGN_ON_REDIRECT_URI);
  signOnParams.set('response_type', 'code');
  signOnParams.set('scope', 'openid');
  signOnUrl.search = signOnParams.toString();
</script>

<section>
  {#if !riotIdentity}
    <a href={signOnUrl.toString()}>Riot ID 연결</a>
  {:else}
    {@const { gameName, tier, rank } = riotIdentity}
    <span>{gameName} ({tier} {rank})</span>
  {/if}
</section>
