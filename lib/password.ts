import "server-only";

import { randomInt } from "node:crypto";

import argon2 from "argon2";

export async function hashPassword(password: string) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

export function generateTemporaryPassword(length = 8) {
  if (length < 1) {
    throw new Error("Password length must be greater than zero.");
  }

  const max = 10 ** length;
  return String(randomInt(0, max)).padStart(length, "0");
}
