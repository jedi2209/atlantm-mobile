export default function (number) {
  return number.toLocaleString('ru-RU');
  //return String(number).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}
