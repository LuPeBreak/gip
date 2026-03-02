export function generatePasswordFromName(nameValue: string): string {
  if (!nameValue) return "";

  // Split name, remove internal spaces, lowercase, remove accents
  const parts = nameValue
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\s+/);

  if (parts.length === 0 || !parts[0]) return "";

  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
  const randomNums = Math.floor(1000 + Math.random() * 9000); // 4 digit random number

  return lastName
    ? `${firstName}.${lastName}${randomNums}`
    : `${firstName}${randomNums}`;
}
