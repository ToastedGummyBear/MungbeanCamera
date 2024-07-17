from flask import Flask, request, jsonify, render_template
import tensorflow as tf
import numpy as np
import cv2
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://192.168.68.116:8081"}})
#CORS(app, resources={r"/*": {"origins": "http://localhost:8081"}})

# Define custom Conv2DTranspose to handle 'groups' parameter issue
class CustomConv2DTranspose(tf.keras.layers.Conv2DTranspose):
    def __init__(self, *args, **kwargs):
        kwargs.pop('groups', None)  # Remove the 'groups' parameter if it exists
        super().__init__(*args, **kwargs)

# Load TensorFlow models with custom objects
try:
    unet_model_path = r'C:\Users\HP Pavilion\Desktop\College\mungbean-latest-main\mungbean-latest-main\assets\model\unet-aug.h5'
    unet_model = tf.keras.models.load_model(unet_model_path,
                                            custom_objects={'Conv2DTranspose': CustomConv2DTranspose})

    classifier_model_path = r'C:\Users\HP Pavilion\Desktop\College\mungbean-latest-main\mungbean-latest-main\assets\model\model.h5'
    classifier_model = tf.keras.models.load_model(classifier_model_path)
except Exception as e:
    print(f"Error loading TensorFlow models: {str(e)}")

# Define class indices
class_indices = {
    0: 'High',
    1: 'Medium',
    2: 'Low'
}

def custom_predict(image_data):
    try:
        # Decode base64 image data
        base64_img_bytes = image_data.encode('utf-8')
        nparr = np.frombuffer(base64.b64decode(base64_img_bytes), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Segment image
        old_size = img.shape[:2]
        ratio = min(256 / old_size[0], 256 / old_size[1])
        new_size = tuple([int(x * ratio) for x in old_size])
        resized_img = cv2.resize(img, (new_size[1], new_size[0]))

        padded_img = np.full((256, 256, 3), (0, 0, 0), dtype=np.uint8)
        pad_h = (256 - new_size[0]) // 2
        pad_w = (256 - new_size[1]) // 2
        padded_img[pad_h:pad_h + new_size[0], pad_w:pad_w + new_size[1]] = resized_img

        normalized_image = padded_img / 255.0
        batched_image = np.expand_dims(normalized_image, axis=0)
        pred_mask = unet_model.predict(batched_image)[0]
        pred_mask = pred_mask > 0.5
        pred_mask = pred_mask * 255

        binary_mask = pred_mask.astype(np.uint8)
        binary_mask = cv2.cvtColor(binary_mask, cv2.COLOR_GRAY2BGR)
        pred_mask_on_image = cv2.bitwise_and(padded_img, binary_mask)

        # Classify segmented image
        image_resized = cv2.resize(pred_mask_on_image, (224, 224))
        image_normalized = image_resized / 255.0
        image_expanded = np.expand_dims(image_normalized, axis=0)
        pred = classifier_model.predict(image_expanded)
        class_idx = np.argmax(pred)
        image_label = class_indices[class_idx]
        # Encode segmented image to base64
        _, buffer = cv2.imencode('.jpg', pred_mask_on_image)
        segmented_image_b64 = base64.b64encode(buffer).decode('utf-8')

        return {
            'segmented_image': segmented_image_b64,
            'image_label': image_label
        }

    except Exception as e:
        return {
            'error': str(e)
        }
def home():
    return render_template('index.html')
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        base64_image = data['image']
        result = custom_predict(base64_image)
        return jsonify(result)
    except Exception as e:
        print(f"Error predicting image: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
