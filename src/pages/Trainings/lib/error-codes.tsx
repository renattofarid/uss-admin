// Enum
// [ TRAINING_CODE_ALREADY_EXISTS, DATE_RANGE_INVALID ]

export enum TrainingErrorCode {
  TRAINING_CODE_ALREADY_EXISTS = 'El código de la capacitación ya existe',
  DATE_RANGE_INVALID = 'El rango de fechas es inválido',
  TRAINING_NOT_HAVE_EXECUTIONS = 'La capacitación no tiene horarios de ejecución',
  MULTIPLE_ROLES_NOT_ALLOWED = 'No se permiten múltiples roles, solo el organizador puede tener múltiples roles',
}