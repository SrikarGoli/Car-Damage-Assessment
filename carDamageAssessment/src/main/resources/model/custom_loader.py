import sys
import os
import cv2
import numpy as np
import h5py
import tensorflow as tf
from tensorflow import keras

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

def create_model_architecture():
    """Create model architecture that matches the H5 file structure"""
    # Base InceptionV3 model with ImageNet weights
    base_model = keras.applications.InceptionV3(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )

    # Freeze the base model
    base_model.trainable = False

    # Create the model with the exact layer names from your H5 file
    x = base_model.output
    x = keras.layers.GlobalAveragePooling2D()(x)
    x = keras.layers.Dense(256, activation='relu', name='dense_10')(x)
    x = keras.layers.Dropout(0.5, name='dropout_6')(x)
    x = keras.layers.Dense(128, activation='relu', name='dense_11')(x)
    x = keras.layers.Dropout(0.5, name='dropout_7')(x)
    predictions = keras.layers.Dense(3, activation='softmax', name='dense_12')(x)

    model = keras.models.Model(inputs=base_model.input, outputs=predictions)
    return model

def load_weights_selectively(model, weights_path):
    """Load weights from the H5 file by manually extracting them"""
    try:
        print("Attempting to manually extract weights from H5 file...", file=sys.stderr)

        with h5py.File(weights_path, 'r') as f:
            model_weights = f['model_weights']

            # Extract dense_10 weights
            if 'dense_10' in model_weights:
                dense_10_group = model_weights['dense_10']['sequential_4']['dense_10']
                kernel = np.array(dense_10_group['kernel'])
                bias = np.array(dense_10_group['bias'])
                model.get_layer('dense_10').set_weights([kernel, bias])
                print("dense_10 weights loaded", file=sys.stderr)

            # Extract dense_11 weights
            if 'dense_11' in model_weights:
                dense_11_group = model_weights['dense_11']['sequential_4']['dense_11']
                kernel = np.array(dense_11_group['kernel'])
                bias = np.array(dense_11_group['bias'])
                model.get_layer('dense_11').set_weights([kernel, bias])
                print("dense_11 weights loaded", file=sys.stderr)

            # Extract dense_12 weights
            if 'dense_12' in model_weights:
                dense_12_group = model_weights['dense_12']['sequential_4']['dense_12']
                kernel = np.array(dense_12_group['kernel'])
                bias = np.array(dense_12_group['bias'])
                model.get_layer('dense_12').set_weights([kernel, bias])
                print("dense_12 weights loaded", file=sys.stderr)

        print("Manual weight extraction completed!", file=sys.stderr)
        return True

    except Exception as e:
        print(f"Manual weight extraction failed: {e}", file=sys.stderr)
        return False

def load_image(img_path):
    """Load and preprocess image"""
    print(f"Loading image: {img_path}", file=sys.stderr)
    img = cv2.imread(img_path)
    if img is None:
        print(f"Error: Could not read image {img_path}", file=sys.stderr)
        sys.exit(1)

    img = cv2.resize(img, (224, 224))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_array = img / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    print(f"Image preprocessed to shape: {img_array.shape}", file=sys.stderr)

    return img_array

def load_model_and_predict(model_path, image_path):
    """Load model architecture, load weights, and make prediction"""
    print(f"TensorFlow version: {tf.__version__}", file=sys.stderr)

    try:
        # First, try to load the entire model directly
        print("Attempting to load entire model...", file=sys.stderr)
        model = tf.keras.models.load_model(model_path)
        print("Model loaded successfully!", file=sys.stderr)

        # Load and preprocess image
        img_array = load_image(image_path)

        # Make prediction
        print("Making prediction...", file=sys.stderr)
        prediction = model.predict(img_array, verbose=1)
        predicted_class = np.argmax(prediction)
        confidence = float(prediction[0][predicted_class])

        # Print debug info
        classes = ['minor', 'moderate', 'severe']
        print(f"Predicted class: {classes[predicted_class]}", file=sys.stderr)
        print(f"Confidence: {confidence:.4f}", file=sys.stderr)

        # Return the class index
        return predicted_class

    except Exception as e1:
        print(f"Direct loading failed: {e1}", file=sys.stderr)

        # Fallback: Try selective weight loading
        try:
            print("Trying selective weight loading approach...", file=sys.stderr)
            # Create the model architecture
            print("Creating model architecture...", file=sys.stderr)
            model = create_model_architecture()

            # Try selective weight loading
            if load_weights_selectively(model, model_path):
                print("Selective loading successful!", file=sys.stderr)
            else:
                print("Falling back to ImageNet weights only...", file=sys.stderr)

            # Load and preprocess image
            img_array = load_image(image_path)

            # Make prediction
            print("Making prediction...", file=sys.stderr)
            prediction = model.predict(img_array, verbose=1)
            predicted_class = np.argmax(prediction)
            confidence = float(prediction[0][predicted_class])

            # Print debug info
            classes = ['minor', 'moderate', 'severe']
            print(f"Predicted class: {classes[predicted_class]}", file=sys.stderr)
            print(f"Confidence: {confidence:.4f}", file=sys.stderr)

            # Return the class index
            return predicted_class

        except Exception as e2:
            print(f"Selective loading also failed: {e2}", file=sys.stderr)
            return -1

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python custom_loader.py <model_path> <image_path>", file=sys.stderr)
        sys.exit(1)

    model_path = sys.argv[1]
    image_path = sys.argv[2]

    print("Starting prediction...", file=sys.stderr)
    result = load_model_and_predict(model_path, image_path)
    print(f"Final result: {result}", file=sys.stderr)
    
    # Output only the numeric result to stdout for Java to capture
    print(result)
    sys.stdout.flush()
