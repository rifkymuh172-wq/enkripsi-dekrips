// === test.js ===
const axios = require('axios');

(async () => {
  const key = 'rahasia123';
  const plaintext = 'Halo dunia dari Rifky';

  try {
    // Kirim ke server enkripsi
    const enc = await axios.post('http://localhost:3001/encrypt', { plaintext, key });
    console.log('Hasil Enkripsi:', enc.data);

    // Kirim ke server dekripsi
    const dec = await axios.post('http://localhost:3002/decrypt', { 
      ciphertext: enc.data.ciphertext, 
      iv: enc.data.iv, 
      key 
    });
    console.log(' Hasil Dekripsi:', dec.data);
  } catch (err) {
    console.error('Terjadi kesalahan:', err.message);
  }
})();
