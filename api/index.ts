import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/server/app.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel strips the /api prefix when rewriting to /api/index,
  // but Express expects full paths like /api/users, /api/attendance etc.
  // We pass the request directly to the Express app.
  return app(req as any, res as any);
}
