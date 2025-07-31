import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { nik, nama, username, password, telp } = await req.json();

    if (!nik || !nama || !username || !password || !telp) {
      return NextResponse.json({ message: 'Semua kolom harus diisi!' }, { status: 400 });
    }

    const existingNIK = await prisma.masyarakat.findUnique({
      where: { nik },
    });

    if (existingNIK) {
      return NextResponse.json(
        {
          message: 'Registrasi Gagal!',
          error: 'NIK sudah terdaftar!',
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: 'Registrasi Gagal!',
          error: 'Username sudah digunakan!',
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: nama,
        username,
        password: hashedPassword,
        role: 'USER', 
      },
    });

    const masyarakat = await prisma.masyarakat.create({
      data: {
        nik,
        nama,
        telp,
        user: {
          connect: { id: newUser.id },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Registrasi Berhasil!',
        user: {
          id: newUser.id,
          username: newUser.username,
          nik: masyarakat.nik,
          nama: masyarakat.nama,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'Server Error',
        error: 'Ooops.. Terjadi kesalahan!',
      },
      { status: 500 }
    );
  }
}
