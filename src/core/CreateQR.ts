
export default function CreateQR(address: string): string {
  const requestURL = 'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=%20' + address
  return requestURL
}
