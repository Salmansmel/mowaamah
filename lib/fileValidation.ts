export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];

export function validateFile(file: File): string | null {
  const lowerName = file.name.toLowerCase();
  const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  if (!hasValidExtension) {
    return 'invalid-type';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'too-large';
  }
  return null;
}
