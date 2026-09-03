import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    };
  }
  interface User {
    role: Role;
  }
}

// Catatan: token JWT next-auth diketik sebagai `any` secara internal di versi
// beta ini, jadi kita tambahkan field kustom (id, role) lewat cast eksplisit
// di bawah alih-alih augmentasi modul "next-auth/jwt" (yang gagal di-resolve
// TypeScript untuk kombinasi versi ini).
type AppJWT = { id: string; role: Role; [key: string]: unknown };

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // Tanpa ini, Auth.js membangun URL redirect setelah login dari
  // NEXTAUTH_URL (mis. "http://localhost:3000" saat dev), BUKAN dari host
  // permintaan yang sesungguhnya — pecah total begitu diakses lewat tunnel,
  // proxy, atau domain produksi yang berbeda dari NEXTAUTH_URL: pengguna
  // login sukses tapi diarahkan ke "localhost:3000/dashboard", yang di dalam
  // WebView Capacitor malah dianggap tautan eksternal dan dilempar ke
  // browser sistem (gagal total, karena localhost di HP bukan mesin dev).
  // Aman diaktifkan di sini karena selalu berjalan di belakang reverse proxy
  // tepercaya sendiri (tunnel dev, atau Vercel/hosting produksi) — bukan
  // menerima trafik langsung dari klien yang bisa memalsukan header Host.
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Kata sandi", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.trim().toLowerCase();
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as AppJWT;
      if (user) {
        t.id = user.id as string;
        t.role = user.role;
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as AppJWT;
      session.user.id = t.id;
      session.user.role = t.role;
      return session;
    },
  },
});
