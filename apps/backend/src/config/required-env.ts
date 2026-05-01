export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === '') {
    throw new Error(`Falta variable de entorno obligatoria: ${name}`);
  }

  return value;
}

export function getRequiredEnvNumber(name: string): number {
  const value = Number(getRequiredEnv(name));

  if (!Number.isFinite(value)) {
    throw new Error(`La variable ${name} debe ser numerica`);
  }

  return value;
}
