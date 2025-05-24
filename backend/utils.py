import pandas as pd
from fastapi import HTTPException

def prepare_input(features: list, expected_length: int, model_name: str, feature_names: list):
    """
    Convierte lista de características en DataFrame validado.
    """
    if len(features) != expected_length:
        raise HTTPException(
            status_code=400,
            detail=f"El modelo '{model_name}' espera {expected_length} características, pero recibió {len(features)}."
        )
    return pd.DataFrame([features], columns=feature_names)
