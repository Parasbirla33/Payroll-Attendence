"""Helpers for converting Streamlit camera bytes to numpy/OpenCV images."""
from __future__ import annotations

import numpy as np
from PIL import Image
import io


def bytes_to_bgr_array(image_bytes: bytes) -> np.ndarray:
    """Streamlit's st.camera_input gives JPEG bytes; DeepFace/OpenCV expect a BGR numpy array."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    rgb = np.array(image)
    return rgb[:, :, ::-1].copy()  # RGB -> BGR
