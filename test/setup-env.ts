process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-e2e';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://test:test@127.0.0.1:5432/test?schema=public';
