import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib
from implementations.gradient_descent import GradientDescentOptimizer

# Función sigmoide
def sigmoid(z):
    return 1 / (1 + np.exp(-z))


# Función de costo: log-loss
def logistic_cost_function(X, y, theta):
    """
    Calcula el error logarítmico (log-loss) para regresión logística.
    """
    m = len(y)
    predictions = sigmoid(X @ theta)
    # Evitar log(0)
    epsilon = 1e-15
    predictions = np.clip(predictions, epsilon, 1 - epsilon)
    cost = - (1 / m) * np.sum(y * np.log(predictions) + (1 - y) * np.log(1 - predictions))
    return cost


# Gradiente de la función de costo
def logistic_gradient(X, y, theta):
    """
    Calcula el gradiente de la función log-loss para regresión logística.
    """
    m = len(y)
    predictions = sigmoid(X @ theta)
    gradient = (1 / m) * (X.T @ (predictions - y))
    return gradient


class LogisticRegressionOvR:
    def __init__(self, alpha=0.01, n_iter=1000, verbose=False):
        self.alpha = alpha
        self.n_iter = n_iter
        self.verbose = verbose
        self.scaler = StandardScaler()
        self.classifiers = []
        self.feature_names = None
        self.class_names = None

    def fit(self, X: pd.DataFrame, y_encoded, class_names=None):
        self.feature_names = list(X.columns)
        self.class_names = class_names
        X_values = X.values
        self.scaler.fit(X_values)
        X_scaled = self.scaler.transform(X_values)
        X_bias = np.hstack([np.ones((X_scaled.shape[0], 1)), X_scaled])

        n_classes = y_encoded.shape[1]
        self.classifiers = []

        for i in range(n_classes):
            if self.verbose:
                nombre_clase = self.class_names[i] if self.class_names else f"Clase {i}"
                print(f"\n🔄 Entrenando clasificador binario para clase: '{nombre_clase}' ({i})")
            y_binary = y_encoded[:, i].reshape(-1, 1)
            optimizer = GradientDescentOptimizer(alpha=self.alpha, n_iter=self.n_iter, verbose=self.verbose)
            optimizer.fit(X_bias, y_binary, logistic_cost_function, logistic_gradient)
            self.classifiers.append(optimizer)

    def predict_proba(self, X):
        X_scaled = self.scaler.transform(X.values)
        X_bias = np.hstack([np.ones((X_scaled.shape[0], 1)), X_scaled])
        probs = np.hstack([
            sigmoid(X_bias @ model.theta).reshape(-1, 1) for model in self.classifiers
        ])
        return probs

    def predict(self, X):
        probs = self.predict_proba(X)
        return np.argmax(probs, axis=1)

    def predict_labels(self, X):
        """
        Devuelve los nombres de las clases predichas (en lugar de los índices)
        """
        class_indices = self.predict(X)
        return [self.class_names[i] for i in class_indices]

    def predict_labels_probas(self, X):
        """
        Devuelve una lista de tuplas (clase_predicha, probabilidad_asociada)
        para cada ejemplo en X.
        """
        probs = self.predict_proba(X)
        class_indices = np.argmax(probs, axis=1)
        max_probs = np.max(probs, axis=1)

        return [(self.class_names[idx], prob) for idx, prob in zip(class_indices, max_probs)]

    def save(self, path_prefix="modelo_log"):
        joblib.dump({
            "classifiers": [model.theta for model in self.classifiers],
            "scaler": self.scaler,
            "alpha": self.alpha,
            "n_iter": self.n_iter,
            "feature_names": self.feature_names,
            "class_names": self.class_names
        }, f"{path_prefix}.pkl")
        if self.verbose:
            print(f"✅ Modelo guardado como {path_prefix}.pkl")

    def load(self, path_prefix="modelo_log"):
        data = joblib.load(f"{path_prefix}.pkl")
        self.alpha = data["alpha"]
        self.n_iter = data["n_iter"]
        self.scaler = data["scaler"]
        self.feature_names = data["feature_names"]
        self.class_names = data["class_names"]
        thetas = data["classifiers"]
        self.classifiers = []
        for theta in thetas:
            opt = GradientDescentOptimizer(self.alpha, self.n_iter, verbose=False)
            opt.theta = theta
            self.classifiers.append(opt)
        if self.verbose:
            print(f"✅ Modelo cargado desde {path_prefix}.pkl")
