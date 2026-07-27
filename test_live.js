const fs = require('fs');
const crypto = require('crypto');

async function test() {
  try {
    const formData = new FormData();
    const blob = new Blob(['Mock docx text'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    formData.append('file', blob, 'test.docx');
    
    console.log("Fetching live analyze API...");
    const res = await fetch('https://mowaamah-o9cflf4q8-sa-lman.vercel.app/api/analyze', {
      method: 'POST',
      body: formData
    });
    
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Gaps[0]:", json.gaps[0]);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
test();
