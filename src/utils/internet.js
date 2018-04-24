export default async function () {
  const isConnected = await fetch("https://www.google.com");
  return !!isConnected;
}

