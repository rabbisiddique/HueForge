import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the Prisma user
    const prismaUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!prismaUser) {
      return NextResponse.json([], { status: 200 }); // no palettes yet
    }

    const typographyData = await prisma.typography.findMany({
      where: { userId: prismaUser.id },
    });

    return NextResponse.json(typographyData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
