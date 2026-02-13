export function getAvatarFallbackByName(name: string) {
  return name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
