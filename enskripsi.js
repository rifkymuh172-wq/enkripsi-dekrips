// server-encrypt.js
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');


const app = express();
app.use(bodyParser.json());


// Config: gunakan env atau default untuk demo
const PORT = process.env.ENCRYPT_PORT || 3001;
const ALGORITHM = 'aes-256-cbc';


function generateKeyFromString(keyStr) {
// Buat 32 bytes key (aes-256)
return crypto.createHash('sha256').update(String(keyStr)).digest();
}


app.post('/encrypt', (req, res) => {
try {
const { plaintext, key } = req.body;
if (!plaintext || !key) return res.status(400).json({ error: 'plaintext and key required' });


const iv = crypto.randomBytes(16); // 16 bytes IV
const derivedKey = generateKeyFromString(key);
const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
let encrypted = cipher.update(String(plaintext), 'utf8', 'base64');
encrypted += cipher.final('base64');


return res.json({ ciphertext: encrypted, iv: iv.toString('base64') });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'encryption failed' });
}
});


app.listen(PORT, () => console.log(`Encrypt Server running on port ${PORT}`));