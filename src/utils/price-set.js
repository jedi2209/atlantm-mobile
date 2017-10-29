export default function (price) {
  return String(price).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
