export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith('.pdf')) {
    // pdfjs-dist optionally uses the native @napi-rs/canvas package to polyfill
    // DOMMatrix/Path2D in Node — that native binary isn't available in Vercel's
    // serverless runtime, and without it pdfjs-dist crashes even for plain text
    // extraction. Provide a pure-JS DOMMatrix polyfill instead so it never needs
    // native canvas at all.
    if (typeof (globalThis as { DOMMatrix?: unknown }).DOMMatrix === 'undefined') {
      const { default: CSSMatrix } = await import('dommatrix');
      (globalThis as { DOMMatrix?: unknown }).DOMMatrix = CSSMatrix;
    }

    // Legacy Node build; its default (non-strict) parsing mode auto-recovers
    // from malformed cross-reference tables (seen in some PDF-generator output).
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const doc = await pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      useSystemFonts: true,
    }).promise;

    try {
      const pageTexts: string[] = [];
      for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
        const page = await doc.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ');
        pageTexts.push(pageText);
      }
      return pageTexts.join('\n');
    } finally {
      await doc.cleanup();
    }
  }

  if (lowerName.endsWith('.docx')) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error('Unsupported file type');
}
