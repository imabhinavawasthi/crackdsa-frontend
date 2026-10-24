/**
 * In-memory client-side media decryption utility.
 * Decrypts AES-256-GCM encrypted media tokens (video_url, class_recording, class_link)
 * so that plaintext Google Drive / Zoom links are never exposed in backend API responses.
 */

const DEFAULT_SECRET = "crackdsa-secure-media-key-2026-production-vault";

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

let cachedSubtleKey: CryptoKey | null = null;

async function getCryptoKey(): Promise<CryptoKey | null> {
  if (cachedSubtleKey) return cachedSubtleKey;
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    return null;
  }

  try {
    const secret = process.env.NEXT_PUBLIC_MEDIA_ENCRYPTION_KEY || DEFAULT_SECRET;
    const encoder = new TextEncoder();
    const secretHash = await window.crypto.subtle.digest("SHA-256", encoder.encode(secret));

    cachedSubtleKey = await window.crypto.subtle.importKey(
      "raw",
      secretHash,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    return cachedSubtleKey;
  } catch (err) {
    console.error("[mediaSecurity] Failed to initialize decryption key:", err);
    return null;
  }
}

/**
 * Decrypts an encrypted media token (enc:v1:<nonce>:<ciphertext>) in memory.
 * If the input is not encrypted, returns it unchanged.
 */
export async function decryptMediaUrl(token: string | null | undefined): Promise<string> {
  if (!token) return "";
  if (!token.startsWith("enc:v1:")) {
    return token;
  }

  const parts = token.split(":");
  if (parts.length !== 4) {
    return token;
  }

  const [, , nonceHex, ctHex] = parts;

  try {
    const key = await getCryptoKey();
    if (!key) return "";

    const iv = hexToBytes(nonceHex);
    const ct = hexToBytes(ctHex);

    const decryptedBuf = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv as unknown as BufferSource },
      key,
      ct as unknown as BufferSource
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuf);
  } catch (err) {
    console.error("[mediaSecurity] Decryption error:", err);
    return "";
  }
}
