export default function (number) {
  return String(number).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}
