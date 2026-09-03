import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Proyek Android native (Capacitor) — kode Java/Gradle/berkas hasil
    // build, bukan bagian dari codebase Next.js yang di-lint di sini.
    "android/**",
    "Desain Aplikasi*",
    "Desain Aplikasi*/**",
  ]),
]);

export default eslintConfig;
