// प्रोग्राम शुरू हुआ...
console.log("प्रोग्राम शुरू हुआ...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log("पैकेज लोड हो गए...");

// .env फाइल को लोड करना
dotenv.config();

// ### DEBBUGING LINE ###
// देखते हैं कि API Key कोड तक पहुँच रही है या नहीं
console.log("ENV FILE CHECK: The API key is:", process.env.API_KEY);
// #####################

const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

// Google AI सेटअप
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/generate-proposal', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ proposal: text });
  } catch (error) {
    // हम यहाँ पूरा एरर दिखाएंगे ताकि पता चले क्या हुआ
    console.error('FULL AI ERROR:', error); 
    res.status(500).json({ error: 'AI से कंटेंट जेनरेट करने में कुछ दिक्कत हुई।' });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend server http://localhost:${port} पर चल रहा है`);
});