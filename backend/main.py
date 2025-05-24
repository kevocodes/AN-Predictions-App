from fastapi import FastAPI, File, UploadFile, HTTPException
import pandas as pd
from io import BytesIO
from schemas import RegressionInput, ClassificationInput
from utils import prepare_input
from implementations.linear_model import LinearRegressorGD
from implementations.logistic_model import LogisticRegressionOvR

app = FastAPI()

# Modelos
reg_model = LinearRegressorGD()
reg_model.load("models/regressor")

clf_model = LogisticRegressionOvR()
clf_model.load("models/classifier")

@app.post("/predict/regression")
def predict_regression(data: RegressionInput):
    df_input = prepare_input(
        features=data.features,
        expected_length=len(reg_model.feature_names),
        model_name="regresión lineal",
        feature_names=reg_model.feature_names
    )
    y_pred = reg_model.predict(df_input)[0][0]
    return {"prediction": round(float(y_pred), 4)}

@app.get("/predict/regression/features")
def predict_regression_features():
    return {"features": reg_model.feature_names}

@app.post("/predict/classification")
def predict_classification(data: ClassificationInput):
    df_input = prepare_input(
        features=data.features,
        expected_length=len(clf_model.feature_names),
        model_name="clasificación actividad",
        feature_names=clf_model.feature_names
    )
    label, prob = clf_model.predict_labels_probas(df_input)[0]
    return {
        "activity": label,
        "probability": round(float(prob), 4)
    }

@app.get("/predict/classification/features")
def predict_classification_features():
    return {"features": clf_model.feature_names}

@app.post("/predict/regression/batch")
def predict_regression_batch(file: UploadFile = File(...)):
    if not file.filename.endswith(".xlsx"):
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser .xlsx"
        )

    df = pd.read_excel(BytesIO(file.file.read()))

    if "id" not in df.columns:
        raise HTTPException(
            status_code=400,
            detail="El archivo debe incluir una columna 'id' como primer columna."
        )

    missing = set(reg_model.feature_names) - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Faltan columnas requeridas para el modelo de clasificación: {missing}"
        )

    df_full = df.dropna(subset=reg_model.feature_names)
    if df_full.empty:
        raise HTTPException(
            status_code=400,
            detail="No hay filas completas con todas las features requeridas."
        )

    ids = df_full["id"].tolist()
    df_full = df_full[reg_model.feature_names]

    preds = reg_model.predict(df_full)
    resultados = [{"id": i, "prediction": round(float(p[0]), 4)} for i, p in zip(ids, preds)]
    return {"predictions": resultados, "inputs": df_full.to_dict(orient="records")}


@app.post("/predict/classification/batch")
def predict_classification_batch(file: UploadFile = File(...)):
    if not file.filename.endswith(".xlsx"):
        return {"error": "El archivo debe ser .xlsx"}

    df = pd.read_excel(BytesIO(file.file.read()))

    if "id" not in df.columns:
        raise HTTPException(
            status_code=400,
            detail="El archivo debe incluir una columna 'id' como primer columna."
        )

    missing = set(clf_model.feature_names) - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Faltan columnas requeridas para el modelo de clasificación: {missing}"
        )

    df_full = df.dropna(subset=clf_model.feature_names)
    if df_full.empty:
        raise HTTPException(
            status_code=400,
            detail="No hay filas completas con todas las features requeridas."
        )


    ids = df_full["id"].tolist()
    df_full = df_full[clf_model.feature_names]

    resultados = clf_model.predict_labels_probas(df_full)

    predicciones = [
        {"id": i, "activity": label, "probability": round(float(prob), 4)}
        for i, (label, prob) in zip(ids, resultados)
    ]

    return {"predictions": predicciones, "inputs": df_full.to_dict(orient="records")}
