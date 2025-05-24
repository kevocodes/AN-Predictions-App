// Definición de características para regresión lineal con descripciones
export const LINEAR_FEATURES = [
  {
    name: "T1",
    description: "Temperatura en la cocina (°C)",
  },
  {
    name: "T2",
    description: "Temperatura en la sala (°C)",
  },
  {
    name: "T6",
    description: "Temperatura exterior norte (°C)",
  },
  {
    name: "RH_6",
    description: "Humedad exterior norte (%)",
  },
  {
    name: "T8",
    description: "Temperatura en cuarto de adolecente 2 (°C)",
  },
  {
    name: "RH_8",
    description: "Humedad en cuarto de adolecente 2 (%)",
  },
  {
    name: "RH_9",
    description: "Humedad en cuarto de padres (%)",
  },
  {
    name: "T_out",
    description: "Temperatura exterior (°C)",
  },
  {
    name: "RH_out",
    description: "Humedad exterior (%)",
  },
  {
    name: "hour",
    description: "Hora del día (24h)",
  },
];

// Definición de características para regresión logística con descripciones
export const LOGISTIC_FEATURES = [
  {
    name: "tBodyAcc-max()-X",
    description: "Aceleración máxima del cuerpo en eje X",
  },
  {
    name: "tGravityAcc-mean()-X",
    description: "Media de aceleración gravitacional en eje X",
  },
  {
    name: "tGravityAcc-max()-X",
    description: "Aceleración gravitacional máxima en eje X",
  },
  {
    name: "tGravityAcc-min()-X",
    description: "Aceleración gravitacional mínima en eje X",
  },
  {
    name: "tGravityAcc-energy()-X",
    description: "Energía de aceleración gravitacional en eje X",
  },
  {
    name: "tBodyAccJerk-entropy()-X",
    description: "Entropía de sacudida de aceleración corporal en eje X",
  },
  {
    name: "tBodyAccJerk-entropy()-Y",
    description: "Entropía de sacudida de aceleración corporal en eje Y",
  },
  {
    name: "tBodyAccJerk-entropy()-Z",
    description: "Entropía de sacudida de aceleración corporal en eje Z",
  },
  {
    name: "tBodyAccJerkMag-entropy()",
    description: "Entropía de magnitud de sacudida de aceleración corporal",
  },
  {
    name: "fBodyAcc-entropy()-X",
    description:
      "Entropía de aceleración corporal en dominio de frecuencia en eje X",
  },
  {
    name: "fBodyAccJerk-entropy()-X",
    description:
      "Entropía de sacudida de aceleración corporal en dominio de frecuencia en eje X",
  },
  {
    name: "fBodyAccJerk-entropy()-Y",
    description:
      "Entropía de sacudida de aceleración corporal en dominio de frecuencia en eje Y",
  },
  {
    name: "fBodyAccJerk-entropy()-Z",
    description:
      "Entropía de sacudida de aceleración corporal en dominio de frecuencia en eje Z",
  },
  {
    name: "fBodyBodyAccJerkMag-entropy()",
    description:
      "Entropía de magnitud de sacudida de aceleración corporal en dominio de frecuencia",
  },
  {
    name: "angle(X,gravityMean)",
    description: "Ángulo entre el eje X y la media de gravedad",
  },
];
