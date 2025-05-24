import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib

from implementations.gradient_descent import GradientDescentOptimizer

# Definición de la función de costo
def linear_cost_function(X, y, theta):
    """
    Calcula el error cuadrático medio (MSE) para regresión lineal.
    """
    m = len(y)
    predictions = X @ theta
    error = predictions - y
    cost = (1 / (2 * m)) * np.sum(error ** 2)
    return cost

# Definición del gradiente de la función de costo
def linear_gradient(X, y, theta):
    """
    Calcula el gradiente de la función de costo para regresión lineal.
    """
    m = len(y)
    predictions = X @ theta
    gradient = (1 / m) * (X.T @ (predictions - y))
    return gradient

class LinearRegressorGD:
    def __init__(self, alpha=0.01, n_iter=1000, verbose=False):
        self.alpha = alpha
        self.n_iter = n_iter
        self.verbose = verbose
        self.scaler = StandardScaler()
        self.optimizer = GradientDescentOptimizer(alpha, n_iter, verbose)
        self.feature_names = None

    def fit(self, X: pd.DataFrame, y):
        if y.ndim == 1:
            y = y.reshape(-1, 1)
        self.feature_names = list(X.columns)
        X_values = X.values
        self.scaler.fit(X_values)
        X_scaled = self.scaler.transform(X_values)
        X_bias = np.hstack([np.ones((X_scaled.shape[0], 1)), X_scaled])
        self.optimizer.fit(X_bias, y, linear_cost_function, linear_gradient)

    def predict(self, X):
        X_scaled = self.scaler.transform(X.values)
        X_bias = np.hstack([np.ones((X_scaled.shape[0], 1)), X_scaled])
        return self.optimizer.predict(X_bias)

    def get_weights(self):
        return self.optimizer.theta[1:]

    def get_bias(self):
        return self.optimizer.theta[0][0]

    def print_params(self):
        coef_df = pd.DataFrame({
            "Feature": ["bias"] + self.feature_names,
            "Coeficiente": [self.get_bias()] + self.get_weights().flatten().tolist()
        })
        display(coef_df)

    def get_cost_history(self):
        return self.optimizer.cost_history

    def save(self, path_prefix="modelo"):
        joblib.dump({
            "theta": self.optimizer.theta,
            "scaler": self.scaler,
            "alpha": self.alpha,
            "n_iter": self.n_iter,
            "feature_names": self.feature_names
        }, f"{path_prefix}.pkl")
        if self.verbose:
            print(f"✅ Modelo guardado como {path_prefix}.pkl")

    def load(self, path_prefix="modelo"):
        data = joblib.load(f"{path_prefix}.pkl")
        self.optimizer.theta = data["theta"]
        self.scaler = data["scaler"]
        self.alpha = data["alpha"]
        self.n_iter = data["n_iter"]
        self.feature_names = data["feature_names"]
        if self.verbose:
            print(f"✅ Modelo cargado desde {path_prefix}.pkl")