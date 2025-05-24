import numpy as np

class GradientDescentOptimizer:
    def __init__(self, alpha=0.01, n_iter=1000, verbose=False):
        self.alpha = alpha
        self.n_iter = n_iter
        self.verbose = verbose
        self.cost_history = []

    def fit(self, X, y, cost_function, gradient_function):
        """
        Entrena los parámetros usando descenso de gradiente.

        Parámetros:
        - X: matriz de entrada (m x n)
        - y: vector de salida real (m x 1)
        - cost_function: función de pérdida a minimizar
        - gradient_function: gradiente de la función de pérdida

        Devuelve:
        - theta: parámetros optimizados
        """
        m, n = X.shape
        self.theta = np.zeros((n, 1))

        for i in range(self.n_iter):
            gradient = gradient_function(X, y, self.theta)
            self.theta -= self.alpha * gradient

            cost = cost_function(X, y, self.theta)
            self.cost_history.append(cost)

            if self.verbose and i % 100 == 0:
                print(f"Iteración {i}: Costo = {cost:.4f}")

        return self

    def predict(self, X):
        return X @ self.theta
