import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { sanitizeEnvValue } from "@/lib/env";

declare global {
  var __melovisionPrisma__: PrismaClient | undefined;
}

const databaseUrl = sanitizeEnvValue(process.env.DATABASE_URL) || "file:./dev.db";

export const prisma =
  global.__melovisionPrisma__ ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: databaseUrl as `file:${string}` | ":memory:",
    }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__melovisionPrisma__ = prisma;
}
