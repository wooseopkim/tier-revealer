import getDate from '$lib/time/getDate';
import * as cheerio from 'cheerio';

interface Params {
  identificationCode: string;
}

export default async function getGallogPosts({ identificationCode }: Params) {
  const url = `https://gallog.dcinside.com/${encodeURIComponent(identificationCode)}/`;
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const posts = $('.gallog_cont:not(.gstbook) .cont')
    .toArray()
    .map((x) => {
      const $ = cheerio.load(x);
      const postTitle = $('.galltit').text().trim();
      const galleryName = $('.gall_name').text().trim();
      const galleryLink = $('.gall_linkbox a.link[href]').attr('href');
      const dateString = $('.date').text().trim();

      const galleryId = new URL(galleryLink ?? '').searchParams.get('id');

      const { yyyy, MM, dd } =
        dateString?.match(/^(?<yyyy>\d{4})\.(?<MM>\d{1,2})\.(?<dd>\d{1,2})$/)?.groups ?? {};
      const date = getDate({
        yyyy: parseInt(yyyy, 10) || 9999,
        MM: parseInt(MM, 10) || 12,
        dd: parseInt(dd, 10) || 31,
        HH: 0,
        ii: 0,
        ss: 0,
        timeZone: 'Asia/Seoul',
      });

      return { galleryName, galleryId, postTitle, date };
    });
  return posts;
}
