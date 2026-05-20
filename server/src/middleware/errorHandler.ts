import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Generate error ID for tracing
  const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const isDev = process.env.NODE_ENV !== 'production';

  // Detect error type and provide hints
  let errorHint = '';
  const errorMsg = err.message || '';

  if (errorMsg.includes('ECONNREFUSED')) {
    errorHint = 'Database connection refused. Check DATABASE_URL and DIRECT_URL are set correctly.';
  } else if (errorMsg.includes('no such table') || errorMsg.includes('relation')) {
    errorHint = 'Database table/relation not found. Run migrations: npm run db:push';
  } else if (errorMsg.includes('permission denied') || errorMsg.includes('authentication failed')) {
    errorHint = 'Database authentication failed. Check DATABASE_URL credentials.';
  } else if (errorMsg.includes('timeout') || errorMsg.includes('ETIMEDOUT')) {
    errorHint = 'Database connection timeout. The database may be unreachable or slow to respond.';
  } else if (errorMsg.includes('PrismaClientInitializationError')) {
    errorHint = 'Prisma client initialization failed. Check environment variables and database connectivity.';
  } else if (errorMsg.includes('PrismaClientValidationError')) {
    errorHint = 'Invalid database query. This is likely a code issue, not a configuration issue.';
  } else if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('getaddrinfo')) {
    errorHint = 'Database host not found. Check DATABASE_URL hostname is correct.';
  }

  // Log detailed error info for debugging
  console.error(`\n❌ [${errorId}] Unhandled Error at ${new Date().toISOString()}`);
  console.error('━'.repeat(80));
  console.error(`Error Type: ${err.name}`);
  console.error(`Message: ${err.message}`);
  if (errorHint) console.error(`💡 Hint: ${errorHint}`);
  if (isDev && err.stack) {
    console.error('\nStack Trace:');
    console.error(err.stack);
  }
  console.error('━'.repeat(80) + '\n');

  res.status(500).json({
    success: false,
    message: isDev ? err.message : 'Internal server error',
    ...(isDev && { errorId, hint: errorHint }),
  });
};
