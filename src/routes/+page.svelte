<script lang="ts">
	import { PUBLIC_RIOT_SIGN_ON_CLIENT_ID, PUBLIC_RIOT_SIGN_ON_REDIRECT_URI } from "$env/static/public";
	import { onMount } from "svelte";

  const signOnUrl = new URL('https://auth.riotgames.com');
  signOnUrl.pathname = 'authorize';
  const signOnParams = new URLSearchParams();
  signOnParams.set('client_id', PUBLIC_RIOT_SIGN_ON_CLIENT_ID);
  signOnParams.set('redirect_uri', PUBLIC_RIOT_SIGN_ON_REDIRECT_URI);
  signOnParams.set('response_type', 'code');
  signOnParams.set('scope', 'openid');
  signOnUrl.search = signOnParams.toString();

  const idToken: Promise<string | null> = new Promise((resolve) => {
    onMount(() => {
      const params = new URLSearchParams(location.search);
      if (params.has('id_token')) {
        localStorage.setItem('idToken', params.get('id_token')!);
      }
      resolve(localStorage.getItem('idToken'));
    });
  });
</script>

{#await idToken}
  <span>Riot ID 연결 확인 중</span>
{:then value} 
  {#if value === null}
    <a href={signOnUrl.toString()}>Riot ID 연결</a>
  {:else}
    <span>Riot ID 연결 완료</span>
  {/if}
{/await}
