import getDate from '@tier-revealer/lib/time/getDate';
import * as cheerio from 'cheerio';

interface Params {
  identificationCode: string;
}

export default async function getGuestbookComments({ identificationCode }: Params) {
  const url = `https://gallog.dcinside.com/${encodeURIComponent(identificationCode)}/guestbook`;
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const comments = $('#gb_comments .inr')
    .toArray()
    .map((x) => {
      const $ = cheerio.load(x);
      const identificationCode = $('.user_data a[href]').attr('href')?.replace(/^\//, '');
      const dateString = $('.date').text();

      const { yyyy, MM, dd, HH, ii, ss } =
        dateString?.match(
          /(?<yyyy>\d{4})\.(?<MM>\d{1,2})\.(?<dd>\d{1,2}) (?<HH>\d{1,2}):(?<ii>\d{1,2}):(?<ss>\d{1,2})/,
        )?.groups ?? {};
      const date = getDate({
        yyyy: parseInt(yyyy, 10) || 9999,
        MM: parseInt(MM, 10) || 12,
        dd: parseInt(dd, 10) || 31,
        HH: parseInt(HH, 10) || 23,
        ii: parseInt(ii, 10) || 59,
        ss: parseInt(ss, 10) || 59,
        timeZone: 'Asia/Seoul',
      });

      const content = $('.memo').text();
      return { identificationCode, date, content };
    });
  return comments;
}
