# Eye disease detection

*Automatically synced with  [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/thrishulks20-4401s-projects/v0-eye-disease-detection)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/sdybiXsHzIi)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes made to deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/thrishulks20-4401s-projects/v0-eye-disease-detection](https://vercel.com/thrishulks20-4401s-projects/v0-eye-disease-detection)**

# Project Overview

This project trains a neural network to classify retinal fundus images for eye diseases (for example: diabetic retinopathy, macular edema, glaucoma indicators). It includes data preprocessing, augmentation, model training, evaluation, and scripts for running inference on new images.

⸻

# Key Features
	•	Configurable training pipeline (supports transfer learning + custom CNNs)
	•	Image preprocessing and augmentation
	•	Training & validation splits, checkpointing, and logging
	•	Evaluation with accuracy, precision, recall, F1, AUC
	•	Example inference script to classify a single image
	•	Docker-ready / exportable model (ONNX / SavedModel) for deployment
# Datasets

Commonly-used fundus datasets (examples you might use):
	•	EyePACS / Kaggle Diabetic Retinopathy — labeled fundus images for DR severity.
	•	APTOS — diabetic retinopathy dataset.
	•	MESSIDOR — diabetic retinopathy dataset.
	•	Local clinical datasets — if you have permission and anonymization.

Important: Keep patient data privacy in mind. Follow any IRB / institutional rules and anonymize metadata before sharing.

Place raw images in data/raw/ and run the preprocessing script to convert them to the structure expected by the training script.
