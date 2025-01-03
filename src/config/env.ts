import { z } from 'zod';

/**
 * Schema walidacji zmiennych środowiskowych
 */
const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_API_KEY: z.string().min(1),
  VITE_MAX_REQUESTS_PER_MINUTE: z.string().transform(Number).pipe(z.number().positive()),
  VITE_EPHE_PATH: z.string().min(1),
  VITE_DEFAULT_LOCATION: z.string().default('Warszawa, Polska'),
  VITE_GEOLOCATION_TIMEOUT: z.string().transform(Number).pipe(z.number().positive()).default('5000'),
  VITE_GEOLOCATION_RATE_LIMIT: z.string().transform(Number).pipe(z.number().positive()).default('60'),
});

/**
 * Walidacja i eksport zmiennych środowiskowych
 */
const validateEnv = () => {
  const env = {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_API_KEY: import.meta.env.VITE_API_KEY,
    VITE_MAX_REQUESTS_PER_MINUTE: import.meta.env.VITE_MAX_REQUESTS_PER_MINUTE,
    VITE_EPHE_PATH: import.meta.env.VITE_EPHE_PATH,
    VITE_DEFAULT_LOCATION: import.meta.env.VITE_DEFAULT_LOCATION,
    VITE_GEOLOCATION_TIMEOUT: import.meta.env.VITE_GEOLOCATION_TIMEOUT,
    VITE_GEOLOCATION_RATE_LIMIT: import.meta.env.VITE_GEOLOCATION_RATE_LIMIT,
  };

  try {
    return envSchema.parse(env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables');
  }
};

export const env = validateEnv();
