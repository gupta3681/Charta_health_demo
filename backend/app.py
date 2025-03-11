from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware


# Load FastAPI app
app = FastAPI()
# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)


# Load Zero-Shot Classification Model
nlp_model = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Define possible diagnoses (ICD-10 related)
ICD_10_CODES = {
    "hypertension": "I10",
    "type 2 diabetes": "E11.9",
    "asthma": "J45.909",
    "migraine": "G43.909"
}
HCC_CODES = {
    "hypertension": "HCC 18",
    "type 2 diabetes": "HCC 19",
    "asthma": "HCC 20",
    "migraine": "HCC 21"
}

class MedicalRecord(BaseModel):
    patient_name: str
    age: int
    notes: str  # Doctor's notes

@app.post("/assign_codes")
def assign_codes(record: MedicalRecord):
    # Define possible diagnoses for the model
    possible_labels = list(ICD_10_CODES.keys())

    # Get AI-predicted diagnosis
    result = nlp_model(record.notes, candidate_labels=possible_labels)
    
    print(result,"result")

    # Pick the highest-confidence label
    diagnosis = result["labels"][0]

    # Get corresponding ICD-10 & HCC codes
    icd_code = ICD_10_CODES.get(diagnosis, "UNKNOWN")
    hcc_code = HCC_CODES.get(diagnosis, "UNKNOWN")

    return {
        "patient": record.patient_name,
        "diagnosis": diagnosis,
        "icd_10_code": icd_code,
        "hcc_code": hcc_code
    }
