import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { apiRouter } from './routes/api';
import { validateEnv } from './utils/validateEnv';

// Inicjalizacja zmiennych środowiskowych
dotenv.config();
validateEnv();

const app = express();
const PORT = process.env.PORT || 3001;

// Konfiguracja podstawowych zabezpieczeń
app.use(helmet());
app.use(express.json());

// Konfiguracja CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Rate limiting - ograniczenie liczby zapytań
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuta
  max: Number(process.env.VITE_MAX_REQUESTS_PER_MINUTE) || 60,
  message: 'Przekroczono limit zapytań, spróbuj ponownie później',
});

app.use('/api', limiter);

// Routing API
app.use('/api', apiRouter);

// Obsługa błędów
app.use(errorHandler);

// Start serwera
app.listen(PORT, () => {
  console.log(`🚀 Serwer uruchomiony na porcie ${PORT}`);
});

export default app;
