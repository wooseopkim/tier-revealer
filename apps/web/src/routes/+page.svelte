<script lang="ts">
  import DcInsideBridge from '$lib/components/DCInsideBridge.svelte';
  import RiotSignOn from '$lib/components/RiotSignOn.svelte';

  export let data;
</script>

<RiotSignOn data={data.riotData} />
<DcInsideBridge
  connection={data?.riotData?.connections?.find(
    ({ connection_type }) => connection_type === 'dcinside',
  )}
/>
<div>{data.authChallenge}</div>
