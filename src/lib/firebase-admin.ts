import "server-only";
import { getApps, initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

/**
 * Singleton Firebase Admin SDK — dipakai untuk Cloud Storage (unggah
 * berkas). Kredensial diambil otomatis lewat Application Default
 * Credentials:
 *
 * - Di Firebase App Hosting (produksi): otomatis tersedia lewat service
 *   account bawaan backend — tidak perlu setel apa pun.
 * - Di lokal/host lain: perlu salah satu dari:
 *   a) GOOGLE_APPLICATION_CREDENTIALS_JSON — isi lengkap file kunci service
 *      account (JSON) sebagai string, disalin ke env var (paling praktis
 *      untuk platform yang tidak bisa unggah berkas kunci, mis. VPS biasa).
 *   b) GOOGLE_APPLICATION_CREDENTIALS — path ke file kunci service account
 *      JSON yang diunduh dari Firebase Console → Project Settings →
 *      Service Accounts → Generate new private key. JANGAN commit file ini
 *      ke git (sudah dicakup pola `*firebase-adminsdk*.json` di .gitignore).
 */
function getCredential() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    return cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON));
  }
  return applicationDefault();
}

export function getFirebaseStorageBucket() {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
  if (!bucketName) return null;

  if (getApps().length === 0) {
    initializeApp({
      credential: getCredential(),
      storageBucket: bucketName,
    });
  }

  return getStorage().bucket();
}
