<script lang="ts">
  import {
    PUBLIC_RIOT_SIGN_ON_CLIENT_ID,
    PUBLIC_RIOT_SIGN_ON_REDIRECT_URI,
  } from '$env/static/public';
  import type RiotAccount from '@tier-revealer/lib/models/riot/RiotAccount';
  import type RiotLeagueEntry from '@tier-revealer/lib/models/riot/RiotLeagueEntry';

  export let data: {
    account: Omit<RiotAccount, 'summonerId'>;
    leagueEntries: Record<string, RiotLeagueEntry[]>;
  } | null = null;

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
  {#if !data}
    <a href={signOnUrl.toString()}>Riot ID 연결</a>
  {:else}
    <h3>{data.account.gameName}</h3>
    <ul>
      {#each data.leagueEntries.tft as entry}
        <li>{entry.queueType} ({entry.tier} {entry.rank})</li>
      {/each}
    </ul>
  {/if}
</section>
