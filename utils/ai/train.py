
"""
##** Fine-Tune GPT Model Script **##
====================================

This script provides an automated way to fine-tune a GPT model using the OpenAI API. It handles the following steps:

1. **Training File Preparation**: Assumes a pre-prepared JSONL file (`fine_tunning_prepared.jsonl`) for fine-tuning.
2. **File Upload**: Uploads the training file to OpenAI's servers.
3. **Fine-Tune Job Creation**: Initiates a fine-tune job for the specified base model.
4. **Job Monitoring**: Polls the OpenAI API to check the status of the fine-tune job until it completes.

## Configuration
- The script uses the `OPENAI_API_KEY` environment variable for authentication.
- Customize the base model and training file by modifying the `MODEL_NAME` and `TRAINING_FILE` constants.

## Dependencies
- Python 3.7+
- `openai` Python library (`pip install openai`)
- Environment variable `OPENAI_API_KEY` set with your API key.

## Functions
1. **`create_finetune_job(training_file: str, base_model: str) -> str`**
   - Creates a fine-tune job using the OpenAI API.
   - Parameters:
     - `training_file`: The ID of the uploaded training file on OpenAI.
     - `base_model`: The name of the base GPT model to fine-tune.
   - Returns:
     - The ID of the fine-tune job if successful, `None` otherwise.

2. **`check_finetune_status(job_id: str) -> str`**
   - Checks the status of a fine-tune job.
   - Parameters:
     - `job_id`: The ID of the fine-tune job.
   - Returns:
     - The status of the fine-tune job (`succeeded`, `failed`, etc.).

3. **`main()`**
   - Orchestrates the script's workflow:
     - Ensures the training file exists.
     - Uploads the training file to OpenAI.
     - Creates a fine-tune job.
     - Monitors the job status until completion.

## Usage
Run the script using Python:
```bash
python fine_tune_gpt.py
"""

import os
import openai
import json
import time

openai.api_key = os.getenv("OPENAI_API_KEY")

MODEL_NAME = "gpt-4o-mini"
TRAINING_FILE = "fine_tunning_prepared.jsonl"

def create_finetune_job(training_file, base_model):
    """
    Creates a fine-tune job using the OpenAI API.
    """
    try:
        response = openai.FineTune.create(
            model=base_model,
            training_file=training_file,
            suffix="pos-system-model1"
        )
        print("Fine-tune job created:", response["id"])
        return response["id"]
    except Exception as e:
        print("Error creating fine-tune job:", e)
        return None

def check_finetune_status(job_id):
    """
    Checks the status of a fine-tune job.
    """
    try:
        response = openai.FineTune.retrieve(job_id)
        status = response.get("status", "unknown")
        print(f"Job ID {job_id}: Status = {status}")
        return status
    except Exception as e:
        print("Error checking fine-tune status:", e)
        return "error"

def main():
    ### Ensure the training file exists ###
    if not os.path.exists(TRAINING_FILE):
        print(f"Training file {TRAINING_FILE} not found.")
        return

    ### Upload training file to OpenAI ###
    try:
        with open(TRAINING_FILE, "rb") as f:
            print("Uploading training file...")
            upload_response = openai.File.create(file=f, purpose="fine-tune")
            training_file_id = upload_response["id"]
            print(f"Training file uploaded successfully. File ID: {training_file_id}")
    except Exception as e:
        print("Error uploading training file:", e)
        return

    ### Create fine-tune job ###
    job_id = create_finetune_job(training_file_id, MODEL_NAME)
    if not job_id:
        return

    ### Monitor fine-tune job status ###
    while True:
        status = check_finetune_status(job_id)
        if status in ["succeeded", "failed"]:
            print(f"Fine-tune job {job_id} completed with status: {status}")
            break
        time.sleep(30)

if __name__ == "__main__":
    main()