import { Request, Response, NextFunction } from 'express';

/**
 * Klasa do tworzenia błędów aplikacji
 */
export class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware do obsługi błędów
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err instanceof AppError) ? err.statusCode : 500;
  const message = err.message || 'Wystąpił błąd serwera';

  // Log błędu (w produkcji można użyć bardziej zaawansowanego systemu logowania)
  console.error(`[Error] ${statusCode}: ${message}`);
  console.error(err.stack);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
