export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero indexed in JavaScript
  const day = date.getDate();

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const isAM = hours < 12;
  const period = isAM ? '오전' : '오후';

  // Convert hours from 24-hour to 12-hour format
  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  // Pad single-digit month, day and minutes with a leading zero for consistency
  const pad = (num: number) => (num < 10 ? '0' + num : num.toString());

  return `${year}년 ${pad(month)}월 ${pad(day)}일 ${period} ${pad(
    hours,
  )}시 ${pad(minutes)}분`;
}
