import os
from dotenv import load_dotenv
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# THE BRAND NEW 2025 GOOGLE SDK
from google import genai

# 1. Security Check
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not found in .env file!")
    exit()

print("1. Waking up the database...")
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_db = Chroma(persist_directory="./chroma_db", embedding_function=embedding_model)

# 2. The User's Question
question = "What kind of laptop do I get, and how often can I upgrade it?"
print(f"\nUSER QUESTION: {question}\n")

# 3. RETRIEVAL
print("2. Searching private database for the answer...")
search_results = vector_db.similarity_search(question, k=1)
context = search_results[0].page_content
print(f"-> Found relevant company policy: '{context[:50]}...'\n")

# 4. GENERATION
print("3. Asking Google Gemini directly using the new SDK...")
prompt = f"""
You are a helpful HR assistant for Nexus Dynamics.
Use ONLY the following context to answer the employee's question. 
If the answer is not in the context, say "I do not have that information."

Context: 
{context}

Employee Question: 
{question}

Answer:
"""

# Connect using the new Client architecture and the 1.5 flash model
client = genai.Client(api_key=api_key)
response = client.models.generate_content(
    model='gemini-3-flash-preview',
    contents=prompt
)

print("--- AI RESPONSE ---")
print(response.text)