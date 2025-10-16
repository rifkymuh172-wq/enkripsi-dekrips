// server-decrypt.js
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');


const app = express();
app.use(bodyParser.json());


const PORT = process.env.DECRYPT_PORT || 3002;
const ALGORITHM = 'aes-256-cbc';


function generateKeyFromString(keyStr) {
return crypto.createHash('sha256').update(String(keyStr)).digest();
}


app.post('/decrypt', (req, res) => {
try {
const { ciphertext, iv, key } = req.body;
if (!ciphertext || !iv || !key) return res.status(400).json({ error: 'ciphertext, iv and key required' });


const ivBuf = Buffer.from(iv, 'base64');
const derivedKey = generateKeyFromString(key);
const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, ivBuf);
let decrypted = decipher.update(String(ciphertext), 'base64', 'utf8');
decrypted += decipher.final('utf8');


return res.json({ plaintext: decrypted });
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'decryption failed' });
}
});


app.listen(PORT, () => console.log(`Decrypt Server running on port ${PORT}`));