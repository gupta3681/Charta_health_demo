import os
from fastapi import FastAPI
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load FastAPI app
app = FastAPI()
# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can specify your frontend URL)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

load_dotenv()

# Read OpenAI API key from .env
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Define request model
class MedicalRecord(BaseModel):
    patient_name: str
    age: int
    notes: str

# Define ICD-10 & HCC Code Mapping
ICD_10_CODES = {
    "hypertension": "I10",
    "type 2 diabetes": "E11.9",
    "asthma": "J45.909",
    "migraine": "G43.909",
    "chronic kidney disease": "N18.9",
    "heart failure": "I50.9"
}
HCC_CODES = {
    "hypertension": "HCC 18",
    "type 2 diabetes": "HCC 19",
    "asthma": "HCC 20",
    "migraine": "HCC 21",
    "chronic kidney disease": "HCC 22",
    "heart failure": "HCC 23"
}

# Function to call OpenAI GPT-4 API (Updated Version)
def get_diagnosis_from_llm(notes):
    prompt = f"""
    You are a medical assistant specializing in ICD-10 coding.
    Extract the main diagnosis from the following doctor's notes.
    Return only the diagnosis as a single word or phrase.

    Notes: "{notes}"
    """
    
    client = openai.OpenAI(api_key=OPENAI_API_KEY)  # New OpenAI Client
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=20
    )
    print(response.choices[0].message.content)
    
    return response.choices[0].message.content.strip().lower()

@app.post("/assign_codes")
def assign_codes(record: MedicalRecord):
    # Get diagnosis from GPT-4
    diagnosis = get_diagnosis_from_llm(record.notes)

    # Map diagnosis to ICD-10 & HCC codes
    icd_code = ICD_10_CODES.get(diagnosis, "UNKNOWN")
    hcc_code = HCC_CODES.get(diagnosis, "UNKNOWN")

    return {
        "patient": record.patient_name,
        "diagnosis": diagnosis,
        "icd_10_code": icd_code,
        "hcc_code": hcc_code
    }