import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        const petugas = await prisma.petugas.findUnique({
          where: { username },
        });

        if (petugas) {
          const isValid = await bcrypt.compare(password, petugas.password);
          if (!isValid) return null;

          return {
            id: petugas.id_petugas,
            name: petugas.nama_petugas,
            username: username,
            level: petugas.level,
          };
        }

        const masyarakat = await prisma.masyarakat.findUnique({
          where: { username },
        });

        if (masyarakat) {
          const isValid = await bcrypt.compare(password, masyarakat.password);
          if (!isValid) return null;

          return {
            id: masyarakat.nik,
            name: masyarakat.nama,
            username: username,
            level: "MASYARAKAT"
          };
        }

        throw new Error('Akun tidak ditemukan!');
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.level = user.level || null;
        token.username = user.username;
        token.id = user.id || null;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.level = token.level || null;
      session.user.username = token.username || null;
      session.user.id = token.sub || token.id;
      return session;
    },
  },
  pages: {
    signIn: '/masuk',
    error: '/masuk',
  },
  secret: process.env.NEXTAUTH_SECRET,
};