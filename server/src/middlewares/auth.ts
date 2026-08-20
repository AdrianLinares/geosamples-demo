// HTTP Basic admin auth (design D4, spec admin-auth).
// ADMIN_USERS env: comma-separated username:bcrypt-hash pairs.
// Fail-closed: empty/missing config denies everything. 401s are identical
// whether the username or the password was wrong, or no credentials at all.

import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";

export type AdminUser = { username: string; hash: string };

/** Parse `ADMIN_USERS` (e.g. "admin:$2b$10$...,alice:$2b$10$..."). */
export function parseAdminUsers(raw: string | undefined): AdminUser[] {
  if (raw === undefined || raw.trim() === "") return [];
  return raw
    .split(",")
    .map((entry) => {
      const idx = entry.indexOf(":");
      if (idx <= 0) return null;
      return { username: entry.slice(0, idx).trim(), hash: entry.slice(idx + 1).trim() };
    })
    .filter((u): u is AdminUser => u !== null && u.hash.length > 0);
}

/** Freshly read from the environment on every request (fail-closed, testable). */
function currentAdminUsers(): AdminUser[] {
  return parseAdminUsers(process.env.ADMIN_USERS);
}

export function sendAuthRequired(res: Response): void {
  res.set("WWW-Authenticate", 'Basic realm="geosamples"');
  res.status(401).json({ error: "Unauthorized" });
}

/** True when the request carries valid admin credentials. */
export async function validateBasic(req: Request): Promise<boolean> {
  const header = req.headers.authorization;
  if (header === undefined || !header.startsWith("Basic ")) return false;
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const idx = decoded.indexOf(":");
  if (idx <= 0) return false;
  const username = decoded.slice(0, idx);
  const password = decoded.slice(idx + 1);
  const users = currentAdminUsers();
  if (users.length === 0) return false; // fail closed
  for (const user of users) {
    if (user.username === username && (await bcrypt.compare(password, user.hash))) return true;
  }
  return false;
}

/** Require valid admin credentials; identical 401 on missing or invalid. */
export async function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!(await validateBasic(req))) return sendAuthRequired(res);
  next();
}

/**
 * Reads: validate credentials when presented (bad creds still get the
 * identical 401), but let anonymous requests through. Used when AUTH_READS is
 * false (public reads, per design D4).
 */
export async function optionalAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;
  if (header === undefined || !header.startsWith("Basic ")) return next();
  if (!(await validateBasic(req))) return sendAuthRequired(res);
  next();
}

/**
 * Reads: require auth only when AUTH_READS=true; otherwise validate
 * credentials when presented (bad creds still get the identical 401) and let
 * anonymous requests through. Env is read per request so tests can toggle it.
 */
export async function readAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (process.env.AUTH_READS === "true") return adminAuthMiddleware(req, res, next);
  return optionalAdminAuth(req, res, next);
}