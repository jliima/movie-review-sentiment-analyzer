import os
import torch
import uvicorn
import requests
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from dotenv import load_dotenv


load_dotenv()

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=['*'],
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*']
)

hfUsername = os.getenv('HF_USERNAME')
customModelPath = f'{hfUsername}/custom-sentiment-model'

customTokenizer = AutoTokenizer.from_pretrained(customModelPath)
customModel = AutoModelForSequenceClassification.from_pretrained(customModelPath)

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

class SentimentRequest(BaseModel):
  text: str
  model: str

def analyzeCustomSentiment(text):
  inputs = customTokenizer(text, return_tensors='pt', padding='max_length', truncation=True, max_length=256)
  with torch.no_grad():
    outputs = customModel(**inputs)
  probabilities = torch.softmax(outputs.logits, dim=1).numpy()[0]
  sentiment = 'positive' if np.argmax(probabilities) == 1 else 'negative'
  confidence = float(np.max(probabilities))
  return {'sentiment': sentiment, 'confidence': confidence}

def getLlamaPrompt(text):
  return f"""
  Analyze the sentiment of this movie review and estimate confidence (0-1). 
  Respond EXACTLY in format: sentiment='{{positive|negative}}',confidence={{confidence_float}}
  
  Examples of valid responses:
  sentiment='positive',confidence=0.883
  sentiment='negative',confidence=0.724
  
  Review text: "{text}"
  """

def analyzeLlamaSentiment(text):
  headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {GROQ_API_KEY}'
  }
  
  prompt = getLlamaPrompt(text)
  payload = {
    'model': 'llama-3.3-70b-versatile',
    'messages': [
      {'role': 'user', 'content': prompt}
    ]
  }
  
  response = requests.post(GROQ_API_URL, json=payload, headers=headers)
  resultData = response.json()
  rawContent = resultData.get('choices', [{}])[0].get('message', {}).get('content', '').strip().lower()
  
  sentiment = ''
  confidence = 0.0

  try:
    if 'sentiment=' in rawContent and 'confidence=' in rawContent:
      parts = rawContent.split(',')
      sentimentPart = parts[0].split('=')[1].strip("'")
      confidencePart = parts[1].split('=')[1]
      sentiment = 'positive' if 'positive' in sentimentPart else 'negative'
      confidence = float(confidencePart)
  except (IndexError, ValueError) as e:
    print('Error happened: {}', e)
  
  return {'sentiment': sentiment, 'confidence': confidence}

@app.post('/analyze/')
def analyze_sentiment(request: SentimentRequest):
  if request.model == 'custom':
    return analyzeCustomSentiment(request.text)
  elif request.model == 'llama':
    return analyzeLlamaSentiment(request.text)
  else:
    return {'error': 'Invalid model. Use \'custom\' or \'llama\'.'}

if __name__ == '__main__':
  uvicorn.run(app, host='0.0.0.0', port=8000)
