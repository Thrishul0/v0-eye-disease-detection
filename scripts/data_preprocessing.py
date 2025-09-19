"""
Data preprocessing utilities for eye disease detection datasets
Handles OCT2017, Retinal C8, and other Kaggle eye disease datasets
"""

import numpy as np
import pandas as pd
import cv2
import os
from pathlib import Path
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder
import json

class EyeDataPreprocessor:
    def __init__(self):
        self.target_size = (224, 224)
        self.label_encoder = LabelEncoder()
        
    def load_oct2017_dataset(self, data_path):
        """Load and preprocess OCT2017 dataset"""
        print("Loading OCT2017 dataset...")
        
        # OCT2017 dataset structure simulation
        categories = ['CNV', 'DME', 'DRUSEN', 'NORMAL']
        
        images = []
        labels = []
        
        # Simulate loading images from each category
        for category in categories:
            category_path = os.path.join(data_path, category)
            print(f"Processing {category} images...")
            
            # Simulate 250 images per category
            for i in range(250):
                # In real implementation, load actual images
                # img = cv2.imread(image_path)
                # For simulation, create random image
                img = np.random.randint(0, 255, (*self.target_size, 3), dtype=np.uint8)
                
                # Preprocess image
                processed_img = self.preprocess_image(img)
                images.append(processed_img)
                labels.append(category)
        
        return np.array(images), np.array(labels)
    
    def load_retinal_c8_dataset(self, data_path):
        """Load and preprocess Retinal C8 dataset"""
        print("Loading Retinal C8 dataset...")
        
        # Retinal C8 categories
        categories = [
            'Normal', 'Diabetes', 'Glaucoma', 'Cataract',
            'Age related Macular Degeneration', 'Hypertension',
            'Pathological Myopia', 'Other diseases/abnormalities'
        ]
        
        images = []
        labels = []
        
        for category in categories:
            print(f"Processing {category} images...")
            
            # Simulate 200 images per category
            for i in range(200):
                # Simulate retinal fundus image
                img = self.generate_synthetic_retinal_image()
                processed_img = self.preprocess_image(img)
                images.append(processed_img)
                labels.append(category)
        
        return np.array(images), np.array(labels)
    
    def generate_synthetic_retinal_image(self):
        """Generate synthetic retinal fundus image for demonstration"""
        # Create a circular retinal image with typical features
        img = np.zeros((224, 224, 3), dtype=np.uint8)
        
        # Background (retinal color)
        img[:, :] = [180, 120, 80]  # Brownish retinal background
        
        # Add optic disc (bright circular region)
        center_x, center_y = 180, 112
        cv2.circle(img, (center_x, center_y), 25, (255, 200, 150), -1)
        
        # Add blood vessels (dark lines)
        for i in range(5):
            start_point = (center_x + np.random.randint(-30, 30), 
                          center_y + np.random.randint(-30, 30))
            end_point = (np.random.randint(0, 224), np.random.randint(0, 224))
            cv2.line(img, start_point, end_point, (120, 60, 40), 2)
        
        # Add some noise and texture
        noise = np.random.normal(0, 10, img.shape).astype(np.int16)
        img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        
        return img
    
    def preprocess_image(self, image):
        """Preprocess individual image"""
        # Resize image
        if image.shape[:2] != self.target_size:
            image = cv2.resize(image, self.target_size)
        
        # Normalize pixel values
        image = image.astype(np.float32) / 255.0
        
        # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
        if len(image.shape) == 3:
            lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            lab[:, :, 0] = clahe.apply((lab[:, :, 0] * 255).astype(np.uint8)) / 255.0
            image = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        
        return image
    
    def augment_data(self, images, labels, augmentation_factor=2):
        """Apply data augmentation"""
        print(f"Applying data augmentation (factor: {augmentation_factor})...")
        
        augmented_images = []
        augmented_labels = []
        
        for img, label in zip(images, labels):
            # Original image
            augmented_images.append(img)
            augmented_labels.append(label)
            
            # Apply augmentations
            for _ in range(augmentation_factor - 1):
                aug_img = self.apply_random_augmentation(img)
                augmented_images.append(aug_img)
                augmented_labels.append(label)
        
        return np.array(augmented_images), np.array(augmented_labels)
    
    def apply_random_augmentation(self, image):
        """Apply random augmentation to an image"""
        aug_image = image.copy()
        
        # Random rotation
        if np.random.random() > 0.5:
            angle = np.random.uniform(-15, 15)
            center = (image.shape[1] // 2, image.shape[0] // 2)
            rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
            aug_image = cv2.warpAffine(aug_image, rotation_matrix, 
                                     (image.shape[1], image.shape[0]))
        
        # Random brightness adjustment
        if np.random.random() > 0.5:
            brightness_factor = np.random.uniform(0.8, 1.2)
            aug_image = np.clip(aug_image * brightness_factor, 0, 1)
        
        # Random horizontal flip
        if np.random.random() > 0.5:
            aug_image = cv2.flip(aug_image, 1)
        
        # Random noise
        if np.random.random() > 0.7:
            noise = np.random.normal(0, 0.02, aug_image.shape)
            aug_image = np.clip(aug_image + noise, 0, 1)
        
        return aug_image
    
    def create_dataset_splits(self, images, labels, test_size=0.2, val_size=0.1):
        """Create train/validation/test splits"""
        from sklearn.model_selection import train_test_split
        
        # First split: separate test set
        X_temp, X_test, y_temp, y_test = train_test_split(
            images, labels, test_size=test_size, random_state=42, stratify=labels
        )
        
        # Second split: separate train and validation
        val_size_adjusted = val_size / (1 - test_size)
        X_train, X_val, y_train, y_val = train_test_split(
            X_temp, y_temp, test_size=val_size_adjusted, random_state=42, stratify=y_temp
        )
        
        print(f"Dataset splits created:")
        print(f"  Training: {len(X_train)} samples")
        print(f"  Validation: {len(X_val)} samples")
        print(f"  Test: {len(X_test)} samples")
        
        return (X_train, y_train), (X_val, y_val), (X_test, y_test)
    
    def save_processed_data(self, data_splits, save_path):
        """Save processed data to disk"""
        os.makedirs(save_path, exist_ok=True)
        
        (X_train, y_train), (X_val, y_val), (X_test, y_test) = data_splits
        
        # Save data
        np.save(os.path.join(save_path, 'X_train.npy'), X_train)
        np.save(os.path.join(save_path, 'y_train.npy'), y_train)
        np.save(os.path.join(save_path, 'X_val.npy'), X_val)
        np.save(os.path.join(save_path, 'y_val.npy'), y_val)
        np.save(os.path.join(save_path, 'X_test.npy'), X_test)
        np.save(os.path.join(save_path, 'y_test.npy'), y_test)
        
        print(f"Processed data saved to {save_path}")

def main():
    """Main preprocessing pipeline"""
    print("Eye Disease Data Preprocessing Pipeline")
    print("=" * 50)
    
    preprocessor = EyeDataPreprocessor()
    
    # Load datasets (simulated)
    print("\n1. Loading OCT2017 dataset...")
    oct_images, oct_labels = preprocessor.load_oct2017_dataset("data/OCT2017")
    
    print("\n2. Loading Retinal C8 dataset...")
    retinal_images, retinal_labels = preprocessor.load_retinal_c8_dataset("data/RetinalC8")
    
    # Combine datasets
    print("\n3. Combining datasets...")
    all_images = np.concatenate([oct_images, retinal_images])
    all_labels = np.concatenate([oct_labels, retinal_labels])
    
    print(f"Combined dataset: {len(all_images)} images")
    print(f"Unique classes: {len(np.unique(all_labels))}")
    
    # Apply data augmentation
    print("\n4. Applying data augmentation...")
    aug_images, aug_labels = preprocessor.augment_data(all_images, all_labels, 
                                                      augmentation_factor=2)
    
    print(f"Augmented dataset: {len(aug_images)} images")
    
    # Create dataset splits
    print("\n5. Creating dataset splits...")
    data_splits = preprocessor.create_dataset_splits(aug_images, aug_labels)
    
    # Save processed data
    print("\n6. Saving processed data...")
    preprocessor.save_processed_data(data_splits, "processed_data")
    
    print("\n" + "=" * 50)
    print("Data preprocessing completed successfully!")
    print("Processed data is ready for model training.")
    print("=" * 50)

if __name__ == "__main__":
    main()
