export default function dateMsg() {
  let date = new Date().getDate();
  let month = new Date().getMonth() + 1;
  let hours = new Date().getHours();
  let minutes = new Date().getMinutes();

  month = (month < 10) ? `0${month}` : month;
  hours = (hours < 10) ? `0${hours}` : hours;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;
  date = (date < 10) ? `0${date}` : date;

  return `${date}.${month}.${new Date().getFullYear()} ${hours}:${minutes}`;
}
