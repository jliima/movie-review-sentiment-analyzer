# movie-review-sentiment-analyzer

This repository contains code for a movie review sentiment analyzer LLM, that uses a fine-tuned custom model and Llama 3 model via GroqCloud API. The project includes a Jupyter Notebook for dataset preparation and model fine-tuning, a FastAPI backend for serving predictions, and a React UI for user interaction.

The program is made as an answer for a university course called COMP.CS.530 Fine-tuning Large Language Models (LLM). See Technical Assignment_Week 3.pdf for original assignment description.

Hugging face model created and used can be found here: https://huggingface.co/hieroja/custom-sentiment-model

Video demo: https://www.youtube.com/watch?v=Q_YuPJ5Y2OU

## Pre Requirements

- Python 3.8+
- Node.js 14+
- Pip
- npm

### Required python packages
`datasets`
`numpy`
`pandas`
`psutil`
`python-dotenv`
`requests`
`scikit-learn`
`torch`
`transformers`

> ⚠️ **NOTE!**  
> I am using AMD Radeon 6900xt for model training, this requires rocm version of `torch`, which can be installed with ```pip install torch --index-url https://download.pytorch.org/whl/rocm6.3```, without this, the model training will be executed on CPU, which will be really slow! For NVIDIA users, I am sorry but you have to do your own research.


## Setup

### Python Environment

1. Create and activate a virtual environment:
`python -m venv env source env/bin/activate`

2. Install required packages:
`pip install -r requirements.txt`

3. Create a `.env` file in the repository root with:
```properties
HF_USERNAME=your_hugging_face_username 
HF_TOKEN=your_hugging_face_token
GROQ_API_KEY=your_groq_api_key
```

### Running Jupyter Notebook

To run the notebook, with the python venv activated, run: 
`jupyter notebook movie_review_sentiment_analysis.ipynb`


### Backend

1. To start the API backend, with the python venv activated, run:
`python ./backend/main.py`


### React frontend

1. Navigate to the frontend directory: `cd frontend`

2. Install dependencies: `npm install`

3. Start the React app: `npm start`

The UI will be available at http://localhost:3000

## API Endpoint

For each method, model can be either "custom" or "llama".

### cURL example:
```sh
curl -X POST "http://localhost:8000/analyze/" \
     -H "Content-Type: application/json" \
     -d '{"text": "The movie was really nice, I liked it!", "model": "custom"}'
```

Response:

```json
{"sentiment": "positive", "confidence": 0.9976364374160767}
```


### Python request example: 
```python
reviewText = 'The movie was really nice, I liked it!'
model = 'custom' # possible values: custom | llama

response = requests.post(
  url='http://localhost:8000/analyze/', 
  json={
    'text': reviewText, 
    'model': model
    }
  )

  result = response.json()
  print(result)
```

Output:
```json
{"sentiment": "positive", "confidence": 0.9976364374160767}
```

### Postam guide: 

Also Postman can be used to access the endpoint. To do this, create POST request to `` with raw body containing JSON formated keys "text" and "model":

```json
{
    "text": "The movie was really nice, I liked it!",
    "model": "custom"
}
```

Response:

```json
{
    "sentiment": "positive",
    "confidence": 0.9976364374160767
}
```