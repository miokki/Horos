import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import NodeCache from 'node-cache';
import { z } from 'zod';

// Inicjalizacja cache'a z czasem życia 24h i czyszczeniem co 1h
const cache = new NodeCache({
  stdTTL: 24 * 60 * 60, // 24 godziny
  checkperiod: 60 * 60, // sprawdzanie wygasłych kluczy co godzinę
});

const router = Router();

/**
 * Middleware do walidacji klucza API
 */
const validateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.VITE_API_KEY) {
    throw new AppError('Nieprawidłowy klucz API', 401);
  }
  
  next();
};

/**
 * Middleware do cachowania odpowiedzi
 */
interface CustomResponse extends Response {
  json: (body: any) => any;
}

const cacheMiddleware = (duration: number) => {
  return (req: Request, res: CustomResponse, next: NextFunction) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Modyfikacja metody res.json aby cachować odpowiedź
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      cache.set(key, body, duration);
      return originalJson(body);
    };

    next();
  };
};

/**
 * Endpoint testowy
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Endpoint do obliczeń astrologicznych
 * Wymaga klucza API i wykorzystuje cache
 */
// Schema walidacji danych wejściowych
const calculateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data musi być w formacie YYYY-MM-DD'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Czas musi być w formacie HH:mm'),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    city: z.string().min(1),
  }),
});

router.post('/calculate', validateApiKey, cacheMiddleware(24 * 60 * 60), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Walidacja danych wejściowych
    const validatedData = calculateSchema.parse(req.body);

    // TODO: Implementacja obliczeń astrologicznych
    const result = {
      ...validatedData,
      // Tutaj będą dodane właściwe obliczenia
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export { router as apiRouter };
