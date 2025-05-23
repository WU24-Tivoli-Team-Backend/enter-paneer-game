export interface JwtPayload {
  exp?: number; // Expiration time
  iat?: number; // Issued at
  sub?: string; // Subject
  aud?: string; // Audience
  iss?: string; // Issuer
  id?: string; // Custom user ID field
  [key: string]: unknown; // Allow additional custom claims
}

/**
 * Decodes a JWT token without verification
 * Simple function to decode JWT tokens client-side
 *
 * @param token - The JWT token string to decode
 * @returns The decoded payload as an object, or null if decoding fails
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    // Split the token into parts (header, payload, signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    // Get the payload part (second part)
    const payloadB64 = parts[1];

    // Convert base64url to base64
    const base64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");

    // Decode base64
    const rawPayload = window.atob(base64);

    // Parse the JSON
    const jsonPayload = JSON.parse(rawPayload);

    return jsonPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}
