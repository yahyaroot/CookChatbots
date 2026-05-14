const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

// Coba baca .env dari folder backend, jika tidak ada coba dari root project
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
if (!process.env.GEMINI_API_KEY) {
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// ==========================================
// KONFIGURASI MODEL - GANTI MODEL DI SINI
// ==========================================
const MODEL_NAME = "gemini-2.5-flash";
// Alternatif model yang tersedia:
// - "gemini-2.5-flash"      (Cepat, cocok untuk kebanyakan task)
// - "gemini-2.5-pro"        (Lebih powerful, untuk task kompleks)
// - "gemini-2.0-flash"      (Versi sebelumnya)
// - "gemini-1.5-flash"      (Versi lama, stabil)
// - "gemini-1.5-pro"        (Versi lama, powerful)

// Inisialisasi Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Inisialisasi model sekali di awal
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

console.log(`[Server] Menggunakan model: ${MODEL_NAME}`);

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi Multer untuk menyimpan file ke folder 'uploads/'
const upload = multer({ dest: 'uploads/' });

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Mengonversi file lokal menjadi format GenerativePart (Base64)
function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
            mimeType
        },
    };
}

// Menghapus file sementara setelah diproses
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) console.error(`Gagal menghapus file ${filePath}:`, err);
    });
};

// ==========================================
// ENDPOINTS
// ==========================================

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        model: MODEL_NAME,
        timestamp: new Date().toISOString()
    });
});

// 1. Endpoint Teks (/generate-text)
app.post('/generate-text', async(req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt teks diperlukan." });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ success: true, data: responseText });
    } catch (error) {
        console.error("Error di /generate-text:", error);
        res.status(500).json({ error: "Gagal memproses teks." });
    }
});

// 2. Endpoint Gambar (/generate-from-image)
app.post('/generate-from-image', upload.single('file'), async(req, res) => {
    try {
        const { prompt } = req.body;
        const file = req.file;

        if (!prompt || !file) {
            if (file) deleteFile(file.path);
            return res.status(400).json({ error: "Prompt dan file gambar (field: 'file') diperlukan." });
        }

        const imagePart = fileToGenerativePart(file.path, file.mimetype);
        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();

        deleteFile(file.path);
        res.json({ success: true, data: responseText });
    } catch (error) {
        if (req.file) deleteFile(req.file.path);
        console.error("Error di /generate-from-image:", error);
        res.status(500).json({ error: "Gagal memproses gambar." });
    }
});

// 3. Endpoint Dokumen (/generate-from-document)
app.post('/generate-from-document', upload.single('file'), async(req, res) => {
    try {
        const { prompt } = req.body;
        const file = req.file;

        if (!prompt || !file) {
            if (file) deleteFile(file.path);
            return res.status(400).json({ error: "Prompt dan file dokumen (field: 'file') diperlukan." });
        }

        const documentPart = fileToGenerativePart(file.path, file.mimetype);
        const result = await model.generateContent([prompt, documentPart]);
        const responseText = result.response.text();

        deleteFile(file.path);
        res.json({ success: true, data: responseText });
    } catch (error) {
        if (req.file) deleteFile(req.file.path);
        console.error("Error di /generate-from-document:", error);
        res.status(500).json({ error: "Gagal memproses dokumen." });
    }
});

// 4. Endpoint Audio (/generate-from-audio)
app.post('/generate-from-audio', upload.single('file'), async(req, res) => {
    try {
        const { prompt } = req.body;
        const file = req.file;

        if (!prompt || !file) {
            if (file) deleteFile(file.path);
            return res.status(400).json({ error: "Prompt dan file audio (field: 'file') diperlukan." });
        }

        const audioPart = fileToGenerativePart(file.path, file.mimetype);
        const result = await model.generateContent([prompt, audioPart]);
        const responseText = result.response.text();

        deleteFile(file.path);
        res.json({ success: true, data: responseText });
    } catch (error) {
        if (req.file) deleteFile(req.file.path);
        console.error("Error di /generate-from-audio:", error);
        res.status(500).json({ error: "Gagal memproses audio." });
    }
});

// Mulai Server
app.listen(port, () => {
    console.log(`Server API Multimodal Gemini berjalan di http://localhost:${port}`);
    console.log(`Model yang digunakan: ${MODEL_NAME}`);
});