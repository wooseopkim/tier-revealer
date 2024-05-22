import getGuestbookComments from '$lib/third_parties/dcinside/getGuestbookComments';

export async function load() {
  console.log(await getGuestbookComments({ identificationCode: 'fiber3706' }));
}
