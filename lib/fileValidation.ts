export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_EXTENSIONS = ['.docx'];

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
