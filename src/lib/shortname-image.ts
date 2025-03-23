export default function ShortnameImage(text: string) {
  return text
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
}
