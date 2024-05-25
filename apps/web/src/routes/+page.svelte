<script lang="ts">
  import DcInsideBridge from '$lib/components/DCInsideBridge.svelte';
  import RiotSignOn from '$lib/components/RiotSignOn.svelte';

  export let data;
</script>

<RiotSignOn riotIdentity={data.riotIdentity} />
<DcInsideBridge
  connection={data.connections?.find(({ connection_type }) => connection_type === 'dcinside')}
/>
<div>{data.authChallenge}</div>
