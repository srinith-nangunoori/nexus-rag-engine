from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import os

print("1. Loading document...")
# Load the raw text file
loader = TextLoader("company_policy.txt")
document = loader.load()

print("2. Splitting document into chunks...")
# Chop the text into chunks of 500 characters. 
# "chunk_overlap=50" means sentences slightly overlap so we don't accidentally cut a sentence in half!
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.split_documents(document)

print(f"-> Chopped document into {len(chunks)} chunks.")

print("3. Initializing Mathematical Translator (Embedder)...")
# Download a free, open-source AI model that translates English into Numbers
# all-MiniLM-L6-v2 is the industry standard for fast, local text translation
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

print("4. Embedding text and saving to Vector Database...")
# Translate the chunks into numbers and save them in a local folder called "chroma_db"
vector_db = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model,
    persist_directory="./chroma_db"
)

print("SUCCESS: Document ingested and saved to ChromaDB!")