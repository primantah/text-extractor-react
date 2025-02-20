import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from '../node_modules/pdfjs-dist/build/pdf.mjs';
import dotenv from 'dotenv';

dotenv.config();

// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for PDF upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 16 * 1024 * 1024 },
});

// ✅ Corrected Function: Extract text from PDF
async function readTextFromFile(fileBuffer) {
  try {
    // Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(fileBuffer);

    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdfDocument = await loadingTask.promise;

    let fullText = '';
    let pages = {};

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');

      if (pageText.trim()) {
        pages[pageNum] = pageText;
        fullText += `Page ${pageNum}:\n${pageText}\n\n`;
      }
    }

    return { full_text: fullText.trim(), pages };
  } catch (err) {
    console.error('🚨 Error reading PDF:', err);
    throw err;
  }
}

// ✅ API Route: Upload & Extract PDF
app.post('/api/upload', upload.single('file'), async (req, res) => {
  console.log('🔍 File received:', req.file);
  console.log('🔍 Keywords received:', req.body.keywords);

  try {
    const file = req.file;
    const keywords = req.body.keywords;

    if (!file || !keywords) {
      console.log('⚠️ Missing file or keywords');
      return res.status(400).json({ error: 'PDF file and keywords are required.' });
    }

    const txtContent = await readTextFromFile(file.buffer);
    const results = await checkWordsInText(txtContent, keywords);

    console.log('✅ Extracted Results:', results);

    res.json(results);
  } catch (err) {
    console.error('🚨 Error processing file:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Helper: Search for Keywords in Extracted Text
async function checkWordsInText(txtData, wordsInput) {
  const fullText = txtData.full_text;
  const pages = txtData.pages;
  let results = {};

  const words = wordsInput.split(',').map(w => w.trim()).filter(Boolean);

  for (const word of words) {
    let wordInfo = { exists: false, pages: [], sentences: {} };

    if (fullText.toLowerCase().includes(word.toLowerCase())) {
      wordInfo.exists = true;

      for (const [pageNum, pageText] of Object.entries(pages)) {
        if (pageText.toLowerCase().includes(word.toLowerCase())) {
          wordInfo.pages.push(pageNum);

          const sentences = pageText.split(/(?<=\.)\s+/);
          const relevantSentences = sentences
            .filter(sentence => sentence.toLowerCase().includes(word.toLowerCase()))
            .map(sentence => sentence.trim());

          wordInfo.sentences[pageNum] = relevantSentences.map(sentence => ({ text: sentence }));
        }
      }
    }

    results[word] = wordInfo;
  }

  return Object.entries(results).sort((a, b) => (b[1].exists === true) - (a[1].exists === true));
  //return Object.entries(results)
  //.map(([keyword, info]) => ({ keyword, ...info }))
  // .sort((a, b) => (b.exists === true) - (a.exists === true));

}

// ✅ Start the Backend
app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
});