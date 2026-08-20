// API entry point (design D4). Mounts the samples router at /api.
// NODE_ENV=test skips listen() so supertest can import the app directly.

process.env.TZ = process.env.TZ ?? "America/Bogota"; // defensive: scripts already set TZ

import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import winston from "winston";
import { router as samplesRouter } from "./routes/samples.js";

const isTest = process.env.NODE_ENV === "test";

// -- logging ----------------------------------------------------------------
const logger = winston.createLogger({
  level: isTest ? "silent" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`),
  ),
  transports: [new winston.transports.Console()],
});

export function createApp(): express.Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 300, // per IP
      standardHeaders: "draft-7",
      legacyHeaders: false,
      skip: () => isTest,
    }),
  );
  if (!isTest) app.use(morgan("combined"));

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.use("/api", samplesRouter);

  // Unknown API route (the router's own 404 handles /api/*; this catches the rest).
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" });
  });

  // Central error handler: never leak internals.
  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? Number((error as { status: unknown }).status)
        : 500;
    const statusCode = Number.isInteger(status) && status >= 400 && status < 600 ? status : 500;
    logger.error(String(error));
    res.status(statusCode).json({ error: statusCode === 500 ? "Internal server error" : String(error) });
  });

  return app;
}

export const app = createApp();

const port = Number(process.env.PORT ?? 3001);

if (!isTest) {
  app.listen(port, () => {
    logger.info(`geosamples-api listening on http://localhost:${port}`);
  });
}

export { logger };