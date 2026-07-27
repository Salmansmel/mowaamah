export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith('.pdf')) {
    // Call the Python Microservice deployed on Vercel
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
      
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${baseUrl}/api/extract`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error(`Python PDF Extraction failed: ${res.statusText}`);
    }
    
    const data = await res.json();
    return data.text || '';
  }

  if (lowerName.endsWith('.docx')) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error('Unsupported file type');
}
