# NEXUS | Enterprise Retrieval-Augmented Generation (RAG) Engine

NEXUS is an enterprise-grade Knowledge Agent that allows users to chat with private, unstructured corporate documents (like policy handbooks or contracts). By combining semantic vector search with modern Generative AI, the engine generates context-grounded, hallucination-free answers with precise source-attribution tracking.

Built on a decoupled microservice architecture featuring a **Python (FastAPI + LangChain) RAG API**, a local **Chroma Vector Database**, and a **React (Vite + Tailwind CSS) Conversational Chat UI**.

---

##  System Architecture

RAG solves the fundamental limitation of Large Language Models (LLMs): they do not know your private data. NEXUS implements the full RAG pipeline:

1. **Document Ingestion (Data Pipeline):** Raw text documents are loaded, segmented into overlapping semantic chunks (500 characters, 50-character overlap), and mapped into vector space.
2. **Mathematical Embeddings:** Every chunk is translated into a 384-dimensional vector using the open-source `all-MiniLM-L6-v2` Sentence-Transformer model.
3. **Vector Database:** The vectors are indexed and stored locally inside a persistent **ChromaDB** database.
4. **Semantic Retrieval:** When a user asks a question, the server converts the question into a vector, queries ChromaDB using Cosine Similarity Search, and extracts the top relevant document chunk.
5. **Contextual Generation:** The original question and the retrieved context are structured into a strict prompt and sent directly to Google's **Gemini AI** (using the new 2025 `google-genai` SDK) to generate a grounded response.

---

##  Technical Stack

*   **Generative AI & LLM:** Google Gemini API (via the new native `google-genai` SDK)
*   **Vector Search & Orchestration:** LangChain, ChromaDB, HuggingFace (`sentence-transformers`), PyPDF
*   **Backend Server:** FastAPI, Uvicorn, Python-Dotenv (Security/Environment variables)
*   **Frontend Dashboard:** React.js, Vite, Tailwind CSS, Lucide-React, Axios
*   **Version Control:** Git, GitHub 

---

##  Installation & Local Execution

### Prerequisites
*   Google AI Studio API Key (Free)
*   Python 3.10+ (Recommended for stable ML libraries)
*   Node.js v18+

---

### Step 1: Backend Setup (AI & Database)

1. Navigate to the backend directory, initialize your environment, and install dependencies:
```bash
cd backend
python3.10 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn python-multipart langchain langchain-community langchain-huggingface chromadb pypdf sentence-transformers google-genai python-dotenv
```

2. Create a `.env` file inside the `backend` folder and add your API key:
```text
GEMINI_API_KEY=your_actual_google_ai_studio_api_key
```

3. Run the ingestion pipeline to read your corporate documents and launch the server:
```bash
python ingest.py     # Reads company_policy.txt and builds the vector database
python -m uvicorn main:app --reload
```
*   **API Live Server:** `http://127.0.0.1:8000`

---

### Step 2: Frontend Setup (Chat UI)

Open a **new** terminal tab:

```bash
cd frontend
npm install
npm run dev
```
*   **Web Application URL:** `http://localhost:5173`

---