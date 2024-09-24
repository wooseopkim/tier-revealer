interface Params {
  yyyy: number;
  MM: number;
  dd: number;
  HH: number;
  ii: number;
  ss: number;
}

export default function getDate({ yyyy, MM, dd, HH, ii, ss }: Params) {
  const date = new Date();
  date.setFullYear(yyyy);
  date.setMonth(MM - 1);
  date.setDate(dd);
  date.setHours(HH);
  date.setMinutes(ii);
  date.setSeconds(ss);
  date.setMilliseconds(0);
  return date;
}
