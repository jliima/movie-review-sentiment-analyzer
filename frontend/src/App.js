import React, { useState } from 'react'

function App() {
  const [reviewText, setReviewText] = useState('')
  const [selectedModel, setSelectedModel] = useState('custom')
  const [result, setResult] = useState(null)

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:8000/analyze/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: reviewText, model: selectedModel })
    })
    const data = await response.json()
    setResult(data)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Movie Review Analyzer</h1>
      <textarea
        style={{ width: '100%', height: '100px', marginBottom: '10px' }}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder='Enter movie review'
      />
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      >
        <option value='custom'>Custom Model</option>
        <option value='llama'>Llama 3</option>
      </select>
      <button
        onClick={handleSubmit}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      >
        Analyze Sentiment
      </button>
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>Result</h2>
          <p>Sentiment: {result.sentiment}</p>
          <p>Confidence: {result.confidence}</p>
        </div>
      )}
    </div>
  )
}

export default App
