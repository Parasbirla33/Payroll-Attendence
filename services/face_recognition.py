"""Face enrollment and recognition, backed by DeepFace."""
from __future__ import annotations

import os

import numpy as np
from deepface import DeepFace

from config import settings
from db import crud
from db.models import Employee
from utils.image_utils import bytes_to_bgr_array


def _cosine_distance(a: list[float], b: list[float]) -> float:
    va, vb = np.array(a), np.array(b)
    denom = np.linalg.norm(va) * np.linalg.norm(vb)
    if denom == 0:
        return 1.0
    return float(1 - np.dot(va, vb) / denom)


def _represent(image_bytes: bytes, enforce_detection: bool) -> list[float] | None:
    bgr = bytes_to_bgr_array(image_bytes)
    try:
        results = DeepFace.represent(
            bgr,
            model_name=settings.face_match_model,
            detector_backend="mtcnn",
            enforce_detection=enforce_detection,
        )
    except ValueError:
        return None
    if not results:
        return None
    return results[0]["embedding"]


def enroll_face(employee_id: int, image_bytes: bytes, photo_index: int) -> tuple[bool, str]:
    """Save a photo for an employee and store its face embedding. Rejects
    photos with no clearly detectable face rather than enrolling bad data."""
    employee = crud.get_employee(employee_id)
    if employee is None:
        return False, "Employee not found."

    face_dir = os.path.join(settings.faces_dir, f"employee_{employee_id}")
    os.makedirs(face_dir, exist_ok=True)
    image_path = os.path.join(face_dir, f"img_{photo_index}.jpg")
    with open(image_path, "wb") as f:
        f.write(image_bytes)

    embedding = _represent(image_bytes, enforce_detection=True)
    if embedding is None:
        os.remove(image_path)
        return False, "No face detected in that photo — please retake it."

    crud.add_face_embedding(
        employee_id=employee_id,
        embedding=embedding,
        model_name=settings.face_match_model,
        image_path=image_path,
    )
    if not employee.face_image_dir:
        crud.set_employee_face_dir(employee_id, face_dir)
    return True, "Photo enrolled."


def photo_matches_employee(employee_id: int, image_bytes: bytes) -> tuple[bool, float | None, str]:
    """Check a candidate photo's face against an employee's already-enrolled
    photo(s). Used to reject a second enrollment photo that isn't the same
    person as the first."""
    embedding = _represent(image_bytes, enforce_detection=True)
    if embedding is None:
        return False, None, "No face detected in that photo — please retake it."

    stored = crud.get_face_embeddings_for_employee(employee_id, settings.face_match_model)
    if not stored:
        return True, None, "No prior photo to compare against."

    best_distance = min(_cosine_distance(embedding, e) for e in stored)
    if best_distance > settings.face_match_threshold:
        return False, best_distance, "This photo doesn't match the first one enrolled — please retake with the same person."
    return True, best_distance, "Matched."


def recognize_face(image_bytes: bytes) -> tuple[Employee | None, float | None, str]:
    """Match a captured frame against all enrolled employees.
    Returns (employee_or_None, best_distance_or_None, message)."""
    embedding = _represent(image_bytes, enforce_detection=False)
    if embedding is None:
        return None, None, "No face detected. Please try again facing the camera."

    stored = crud.get_all_face_embeddings(settings.face_match_model)
    if not stored:
        return None, None, "No employees enrolled yet."

    best_employee_id: int | None = None
    best_distance = float("inf")
    for employee_id, stored_embedding in stored:
        distance = _cosine_distance(embedding, stored_embedding)
        if distance < best_distance:
            best_distance = distance
            best_employee_id = employee_id

    if best_employee_id is None or best_distance > settings.face_match_threshold:
        return None, best_distance, "Face not recognized. Please contact admin to enroll."

    employee = crud.get_employee(best_employee_id)
    return employee, best_distance, "Matched."
