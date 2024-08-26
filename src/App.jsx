import React, { useState } from 'react';
import axios from 'axios';
import sunIcon from './sun.png';  
import moonIcon from './moon.png'; 
import logoWhite from './assets/logowhite.png';  
import logoBlack from './assets/logoblack.png'; 

const App = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + 
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' + 
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
      '(\\?[;&a-z\\d%_.~+=-]*)?' + 
      '(\\#[-a-z\\d_]*)?$', 'i' 
    );

    if (!urlPattern.test(longUrl)) {
      setError('Please enter a valid URL.');
      return;
    }

    try {
      const response = await axios.post(
        'https://api-ssl.bitly.com/v4/shorten',
        {
          long_url: longUrl,
          domain: 'bit.ly'
        },
        {
          headers: {
            Authorization: `Bearer 9622614cf0aa66c01574a32e132ef717bd8c6e30`, 
            'Content-Type': 'application/json'
          }
        }
      );
      setShortUrl(response.data.link);
    } catch (err) {
      setError('Failed to shorten the URL. Please try again.');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-slate-100'} transition-colors duration-300 relative`}>
      
      <img src={darkMode ? logoWhite : logoBlack} alt="Logo" className="absolute top-4 left-4 w-40 h-6" />

      <button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-400 text-gray-900'}`}
      >
        <img src={darkMode ? sunIcon : moonIcon} alt="Toggle Dark Mode" className="w-6 h-6" />
      </button>

      <div className={`text-center p-8 rounded-lg max-w-md w-full ${darkMode ? 'bg-gray-800 text-white shadow-lg shadow-slate-600' : 'bg-[#c5c2c2] text-gray-900 shadow-lg shadow-slate-400'}`}>
        <h1 className="text-4xl font-bold mb-6">URL Shortener</h1>
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter the long URL"
            className={`w-full p-3 mb-4 rounded border ${darkMode ? 'border-gray-600 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'} outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 rounded text-white hover:bg-blue-700"
          >
            Shorten URL
          </button>
        </form>
        {error && <p className="text-red-400 mt-4">{error}</p>}
        {shortUrl && (
          <p className="mt-4">
            Shortened URL: 
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline ml-2">
              {shortUrl}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
