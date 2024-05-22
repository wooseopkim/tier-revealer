interface Params {
  yyyy: number;
  MM: number;
  dd: number;
  HH: number;
  ii: number;
  ss: number;
  timeZone: string;
}

export default function getDate({ yyyy, MM, dd, HH, ii, ss, timeZone }: Params) {
  const date = new Date();
  date.setFullYear(yyyy);
  date.setMonth(MM - 1);
  date.setDate(dd);
  date.setHours(HH);
  date.setMinutes(ii);
  date.setSeconds(ss);

  const timestamp = Date.parse(date.toLocaleString('en-US', { timeZone }));
  return new Date(timestamp);
}
