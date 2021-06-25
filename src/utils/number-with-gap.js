export default function (number) {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  // return number.toLocaleString('ru-RU');
}
