export function normalizeWhatsAppNumber(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}

export function normalizeBrazilWhatsAppInput(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("55")) return digits.slice(0, 13);

  return `55${digits.slice(0, 11)}`;
}

export function formatBrazilWhatsApp(value: string): string {
  const normalized = normalizeBrazilWhatsAppInput(value);
  if (!normalized) return "";

  const national = normalized.slice(2);
  let formatted = "+55";

  if (!national) return formatted;
  formatted += ` (${national.slice(0, 2)}`;
  if (national.length < 2) return formatted;

  formatted += ") ";
  const phone = national.slice(2);
  const prefixLength = phone.length > 8 ? 5 : 4;

  if (phone.length <= prefixLength) return formatted + phone;
  return `${formatted}${phone.slice(0, prefixLength)}-${phone.slice(prefixLength)}`;
}

export function createWhatsAppUrl(phone: string, message?: string): string {
  const normalizedPhone = normalizeWhatsAppNumber(phone);
  const url = new URL(`https://wa.me/${normalizedPhone}`);

  if (message) {
    url.searchParams.set("text", message);
  }

  return url.toString();
}
