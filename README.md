# 🏥 Medical Diagnosis to ICD-10 & HCC Code Converter

## 📌 Overview

This is a **FastAPI + React** web application that helps assign **ICD-10** and **HCC** codes to medical diagnoses.  
It uses **two AI models**:

1. **Zero-Shot Classification (Transformers)** → Predicts the diagnosis based on medical notes.
2. **GPT-4 (OpenAI)** → Extracts diagnosis from notes using natural language understanding.

## ✨ Features

✅ **FastAPI Backend**: Handles medical text processing and AI-based classification.  
✅ **React Frontend**: User-friendly interface to input patient details and medical notes.  
✅ **Two AI Models**: Uses **Transformers** for zero-shot classification and **GPT-4** for NLP-based diagnosis.  
✅ **ICD-10 & HCC Code Mapping**: Limited to **hypertension, diabetes, asthma, and migraines** (for now).  
✅ **CORS Enabled**: Allows frontend-backend communication.

## ⚠️ Current Limitations

🚨 **Limited Diagnosis List**: Supports only a few medical conditions (`hypertension, type 2 diabetes, asthma, migraine`).  
🚨 **No Database**: No persistence of patient data, just real-time processing.  
🚨 **Limited Accuracy**: Performance depends on model predictions and API responses.

## 🛠️ Tech Stack

- **Frontend**: React (MUI for UI components)
- **Backend**: FastAPI (Python)
- **Machine Learning**: Hugging Face Transformers (`facebook/bart-large-mnli`), OpenAI GPT-4
- **Deployment**: Render

---
