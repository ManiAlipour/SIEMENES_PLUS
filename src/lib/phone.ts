export function normalizeIranPhone(input: string): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, "");
  let national = digits;

  if (national.startsWith("0098")) national = national.slice(4);
  else if (national.startsWith("98") && national.length >= 12) {
    national = national.slice(2);
  }

  if (national.startsWith("9") && national.length === 10) {
    national = `0${national}`;
  }

  if (!/^09\d{9}$/.test(national)) return null;
  return national;
}

export function maskPhone(phone: string): string {
  const normalized = normalizeIranPhone(phone) || phone;
  if (normalized.length < 8) return normalized;
  return `${normalized.slice(0, 4)}***${normalized.slice(-3)}`;
}
