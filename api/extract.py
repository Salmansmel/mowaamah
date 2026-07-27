import fitz # PyMuPDF
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/', defaults={'path': ''}, methods=['POST', 'GET'])
@app.route('/<path:path>', methods=['POST', 'GET'])
def extract_text():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
        
    file = request.files['file']
    if not file or not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Invalid file type. Only PDF is supported.'}), 400

    try:
        # Read the PDF into memory
        pdf_bytes = file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        full_text = []
        for page in doc:
            # text retrieval; sort=True often helps with RTL text flow in some layouts
            page_text = page.get_text("text", sort=True)
            full_text.append(page_text)
            
        doc.close()
        
        return jsonify({
            'text': '\n'.join(full_text)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Vercel needs the application instance to be named 'app'
