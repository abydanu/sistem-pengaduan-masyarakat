import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return NextResponse.json(
      { message: 'Unauthorized: No active session' },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.users.findUnique({
      where: { username: session.user.username },
      include: {
        masyarakat: true,
        petugas: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
      masyarakat: user.masyarakat,
      petugas: user.petugas,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
