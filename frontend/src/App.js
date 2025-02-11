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
    setResult({ ...data, modelUsed: selectedModel, inputText: reviewText })
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Movie Review Sentiment Analyzer</h1>
      <textarea
        style={{ width: '100%', height: '100px', marginBottom: '10px' }}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder='Enter movie review'
      />
      <p>Model</p>
      <select
        value={selectedModel}
        onChange={(e) => {
          setSelectedModel(e.target.value)
          setResult(null)
        }}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      >
        <option value='custom'>Custom Model</option>
        <option value='llama'>Llama 3</option>
      </select>
      <button
        onClick={handleSubmit}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        disabled={!reviewText.trim()}
      >
        Analyze Sentiment
      </button>
      {result && (
        <pre
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f4f4f4',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            maxWidth: '100%'
          }}
        >
          {`Review:     ${result.inputText}
Model used: ${selectedModel}
Sentiment:  ${result.sentiment}
Confidence: ${result.confidence}`}
        </pre>
      )}
    </div>
  )
}

export default App
