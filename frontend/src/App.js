import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // स्टेट वेरिएबल्स: यूजर का इनपुट, AI का जवाब, और लोडिंग की स्थिति को स्टोर करने के लिए
  const [prompt, setPrompt] = useState('');
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);

  // जब यूजर 'Generate' बटन दबाएगा तो यह फंक्शन चलेगा
  const handleSubmit = async (e) => {
    e.preventDefault(); // फॉर्म को रीलोड होने से रोकना
    setLoading(true);   // लोडिंग शुरू
    setProposal('');    // पुराने रिजल्ट को साफ़ करना

    try {
      // हमारे बैकएंड को http://localhost:8000/generate-proposal पर रिक्वेस्ट भेजना
      const response = await axios.post('https://ai-proposal-generator.onrender.com/generate-proposal', {
        prompt: `Write a professional project proposal based on these details: ${prompt}`
      });
      // AI से मिले जवाब को 'proposal' स्टेट में सेव करना
      setProposal(response.data.proposal);
    } catch (error) {
      console.error('Error fetching proposal:', error);
      alert('प्रपोजल जेनरेट करने में कोई समस्या हुई। कृपया बैकएंड सर्वर को जांचें।');
    } finally {
      setLoading(false); // लोडिंग खत्म
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Proposal Generator 📝</h1>
        <p>नीचे बॉक्स में प्रोजेक्ट की जानकारी दें और AI आपके लिए एक प्रपोजल तैयार कर देगा।</p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="जैसे: 'एक रेस्टोरेंट के लिए वेबसाइट बनानी है, जिसमें ऑनलाइन बुकिंग और मेनू का फीचर हो।'"
            rows="5"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Proposal'}
          </button>
        </form>

        {/* अगर 'proposal' में कोई डेटा है, तो उसे दिखाओ */}
        {proposal && (
          <div className="proposal-result">
            <h2>Generated Proposal:</h2>
            <pre>{proposal}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;