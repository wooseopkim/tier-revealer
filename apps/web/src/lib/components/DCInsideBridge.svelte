<script lang="ts">
  export let connection: Record<string, unknown> | undefined = undefined;

  let identificationCode: string;

  $: identificationCode = (connection?.connection_data as string) ?? '';

  async function onIdentificationCodeSubmit() {
    const res = await fetch('/api/connections/dcinside', {
      method: 'POST',
      body: JSON.stringify({
        identificationCode,
      }),
    });
    console.log(res.statusText, await res.text());
  }
</script>

<section>
  <label>
    식별 코드
    <input type="text" bind:value={identificationCode} />
  </label>
  <button on:click={onIdentificationCodeSubmit}>인증</button>
</section>
