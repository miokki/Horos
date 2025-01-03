import { z } from 'zod';

/**
 * Schema walidacji zmiennych środowiskowych
 */
const envSchema = z.object({
  // Server
  PORT: z.string().transform(Number).pipe(z.number().positive()),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  
  // CORS
  CORS_ORIGIN: z.string().url(),
  
  // API
  VITE_API_KEY: z.string().min(1),
  VITE_MAX_REQUESTS_PER_MINUTE: z.string().transform(Number).pipe(z.number().positive()),
  
  // Security
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(32),
  
  // Database
  DB_HOST: z.string(),
  DB_PORT: z.string().transform(Number).pipe(z.number().positive()),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
});

/**
 * Walidacja zmiennych środowiskowych
 * @throws {Error} Jeśli walidacja się nie powiedzie
 */
export const validateEnv = () => {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join('\n');
      throw new Error(`❌ Nieprawidłowe zmienne środowiskowe:\n${issues}`);
    }
    throw error;
  }
};

// Eksport typu dla zmiennych środowiskowych
export type Env = z.infer<typeof envSchema>;
