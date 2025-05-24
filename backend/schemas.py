from pydantic import BaseModel
from typing import List

class RegressionInput(BaseModel):
    features: List[float]

class ClassificationInput(BaseModel):
    features: List[float]
