export const INSTAGRAM_USERNAME_MAX_LENGTH = 30;

export function normalizeInstagramUsername(value: string) {
  const withoutProfileUrl = value
    .trim()
    .replace(/^https?:\/\/(?:www\.)?instagram\.com\//i, "")
    .replace(/^(?:www\.)?instagram\.com\//i, "")
    .replace(/^@+/, "")
    .split(/[/?#]/, 1)[0] ?? "";

  return withoutProfileUrl
    .replace(/[^a-zA-Z0-9._]/g, "")
    .slice(0, INSTAGRAM_USERNAME_MAX_LENGTH);
}

export function getInstagramProfileUrl(value: string) {
  const username = normalizeInstagramUsername(value);
  return username ? `https://instagram.com/${username}` : null;
}
