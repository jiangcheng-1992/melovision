export function sanitizeEnvValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  return trimmed.replace(/^['"`]+|['"`]+$/g, "");
}
