import "server-only";

import { SignJWT, jwtVerify } from "jose";

import type { SessionUser } from "@/types/domain";

const COOKIE_NAME = "caixa-food-session";

function getEncodedSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  user: SessionUser;
};

export async function encryptSession(payload: SessionPayload) {
  const secret = getEncodedSecret();
  if (!secret) {
    throw new Error("SESSION_SECRET não configurado.");
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function decryptSession(token?: string) {
  const secret = getEncodedSecret();
  if (!secret || !token) return null;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };

