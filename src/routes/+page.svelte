<script lang="ts">
  import {
    PUBLIC_RIOT_SIGN_ON_CLIENT_ID,
    PUBLIC_RIOT_SIGN_ON_REDIRECT_URI,
  } from '$env/static/public';
  import { onMount } from 'svelte';
  import idToken from '$lib/store/idToken';

  const signOnUrl = new URL('https://auth.riotgames.com');
  signOnUrl.pathname = 'authorize';
  const signOnParams = new URLSearchParams();
  signOnParams.set('client_id', PUBLIC_RIOT_SIGN_ON_CLIENT_ID);
  signOnParams.set('redirect_uri', PUBLIC_RIOT_SIGN_ON_REDIRECT_URI);
  signOnParams.set('response_type', 'code');
  signOnParams.set('scope', 'openid');
  signOnUrl.search = signOnParams.toString();

  let identity: Promise<Record<string, string>> = new Promise(() => {});

  onMount(() => {
    const params = new URLSearchParams(location.search);

    if (params.has('id_token')) {
      localStorage.setItem('idToken', params.get('id_token')!);
    }

    idToken.set(localStorage.getItem('idToken'));
  });

  onMount(() => {
    idToken.subscribe((value) => {
      if (value === undefined || value === null) {
        return;
      }

      identity = new Promise(async (resolve, reject) => {
        const res = await fetch('/api/riot/me', {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        });

        if (!res.ok) {
          reject(res.statusText);
          idToken.set(null);
          return;
        }

        const json = await res.json();
        resolve(json);
      });
    });
  });
</script>

{#if $idToken === undefined}
  <progress />
{:else if $idToken === null}
  <a href={signOnUrl.toString()}>Riot ID 연결</a>
{:else}
  {#await identity}
    <progress />
  {:then value}
    <span>{value.gameName} ({value.tier} {value.rank})</span>
  {/await}
{/if}
