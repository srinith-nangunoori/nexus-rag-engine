from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from google import genai

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Initialize API and Databases on boot
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db = Chroma(persist_directory="./chroma_db", embedding_function=embedding_model)

# Define the expected request from React
class ChatRequest(BaseModel):
    question: str

@app.get("/")
def home():
    return {"message": "Nexus RAG API is running."}

# 2. The API Endpoint
@app.post("/api/chat")
def chat_endpoint(request: ChatRequest):
    # Retrieve
    search_results = vector_db.similarity_search(request.question, k=1)
    
    # If the database is empty or no match is found
    if not search_results:
         return {"answer": "I couldn't find any relevant company documents to answer that."}
         
    context = search_results[0].page_content
    
    # Generate Prompt
    prompt = f"""
    You are an internal HR assistant for Nexus Dynamics.
    Answer the employee's question using ONLY the context provided below.
    If the context does not contain the answer, say "I do not have that information in my database."
    Do not make anything up.

    Context: 
    {context}

    Employee Question: 
    {request.question}

    Answer:
    """
    
    # Generate Response (Make sure to use the model string that worked for you!)
    response = client.models.generate_content(
        model='gemini-3-flash-preview', # <-- Make sure this matches the one you found!
        contents=prompt
    )
    
    # Return answer and the context it used (for transparency)
    return {
        "answer": response.text,
        "source_used": context
    }